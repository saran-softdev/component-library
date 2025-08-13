import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import {
  getImageConfig,
  getFolderStructure,
  validateImageFile,
  getWebPSettings,
} from "@/config/imageConfig";

export class GoogleCloudStorageService {
  constructor() {
    try {
      const keyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      if (!keyRaw) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_KEY env");
      const serviceAccountKey = JSON.parse(keyRaw);

      this.storage = new Storage({
        projectId: serviceAccountKey.project_id,
        credentials: serviceAccountKey,
      });

      this.bucketName = process.env.GCS_BUCKET_NAME;
      if (!this.bucketName) throw new Error("Missing GCS_BUCKET_NAME env");
      this.bucket = this.storage.bucket(this.bucketName);
    } catch (error) {
      console.error("❌ Failed to initialize Google Cloud Storage:", error);
      throw error;
    }
  }

  generateFileName(originalName, prefix = "") {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `${prefix}${timestamp}-${random}.webp`;
  }

  validateImageFile(file, configType = "DEFAULT") {
    const validation = validateImageFile(file, configType);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }
    return validation;
  }

  async processImage(buffer, config = {}) {
    const {
      width = 1200,
      height = 1200,
      quality = 85,
      format = "webp",
      qualityLevel = quality >= 75 ? "high" : quality >= 70 ? "medium" : "low",
    } = config;

    try {
      const webp = getWebPSettings(qualityLevel);
      const processed = await sharp(buffer)
        .resize(width, height, {
          fit: "inside",
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .webp({
          quality: webp.quality ?? quality,
          effort: webp.effort,
          lossless: webp.lossless,
          nearLossless: webp.nearLossless,
          smartSubsample: webp.smartSubsample,
          reductionEffort: webp.reductionEffort,
          alphaQuality: webp.alphaQuality,
          method: webp.method,
        })
        .toBuffer();

      return processed;
    } catch (error) {
      console.error("❌ Image processing failed:", error);
      throw new Error("Failed to process image");
    }
  }

  async uploadFile(buffer, fileName, options = {}) {
    const {
      folder = "",
      makePublic = true,
      contentType = "image/webp",
      replaceExisting = false,
    } = options;

    try {
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      const file = this.bucket.file(filePath);

      if (replaceExisting) {
        try {
          const [exists] = await file.exists();
          if (exists) await file.delete();
        } catch (e) {
          console.warn("⚠️ Failed to check/delete existing file:", e?.message);
        }
      }

      await file.save(buffer, {
        metadata: {
          contentType,
          cacheControl: "public, max-age=31536000",
        },
        resumable: false,
      });

      if (makePublic) {
        try {
          await file.makePublic();
        } catch (aclError) {
          const uniform =
            typeof aclError?.message === "string" &&
            aclError.message.includes("uniform bucket-level access is enabled");
          if (!uniform) throw aclError;
          console.warn("GCS UBLA enabled; skipping makePublic");
        }
      }

      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
      return { fileName: filePath, publicUrl, success: true };
    } catch (error) {
      console.error("❌ File upload failed:", error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async uploadImage(
    file,
    entityType,
    entityId,
    imageType,
    existingFileName = null
  ) {
    try {
      const configKey = `${String(entityType).toUpperCase()}_${String(
        imageType
      ).toUpperCase()}`;
      const cfg = getImageConfig(configKey);
      this.validateImageFile(file, configKey);

      const folder = getFolderStructure(entityType, entityId, imageType);
      const buffer = Buffer.from(await file.arrayBuffer());
      const processed = await this.processImage(buffer, cfg);
      const fileName = this.generateFileName(file.name);

      if (existingFileName) {
        try {
          await this.deleteFile(existingFileName);
        } catch (e) {
          console.warn("⚠️ Failed to delete existing file:", e?.message);
        }
      }

      const result = await this.uploadFile(processed, fileName, {
        folder: folder.fullPath,
        makePublic: true,
        contentType: "image/webp",
        replaceExisting: false,
      });

      return result;
    } catch (error) {
      console.error("❌ Unified image upload failed:", error);
      throw error;
    }
  }

  async uploadMultipleImages(files, entityType, entityId, imageType) {
    const uploads = files.map((f) =>
      this.uploadImage(f, entityType, entityId, imageType)
    );
    const results = await Promise.allSettled(uploads);
    return results.map((r) =>
      r.status === "fulfilled"
        ? r.value
        : { success: false, error: r.reason?.message }
    );
  }

  async deleteFile(filePath) {
    try {
      const file = this.bucket.file(filePath);
      await file.delete();
      return true;
    } catch (error) {
      console.error("❌ File deletion failed:", error);
      throw error;
    }
  }

  async deleteSpecificImage(entityType, entityId, imageType) {
    const folder = getFolderStructure(entityType, entityId, imageType);
    return this.deleteFolderContents(folder.fullPath);
  }

  async deleteFolderContents(folderPath) {
    const normalized = folderPath.endsWith("/") ? folderPath : `${folderPath}/`;
    const [files] = await this.bucket.getFiles({ prefix: normalized });
    if (!files?.length) return { deleted: 0 };
    let deleted = 0;
    await Promise.allSettled(
      files.map(async (file) => {
        try {
          await file.delete();
          deleted += 1;
        } catch (e) {
          console.warn("⚠️ Failed to delete: ", file.name, e?.message);
        }
      })
    );
    return { deleted };
  }

  async getSignedUrl(filePath, expirationTime = 3600) {
    try {
      const file = this.bucket.file(filePath);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + expirationTime * 1000,
      });
      return url;
    } catch (error) {
      console.error("❌ Failed to get signed URL:", error);
      throw error;
    }
  }

  async initializeBucket() {
    const [exists] = await this.bucket.exists();
    if (!exists) await this.bucket.create();
    return true;
  }

  async getFileMetadata(filePath) {
    const file = this.bucket.file(filePath);
    const [metadata] = await file.getMetadata();
    return metadata;
  }
}

const gcsService = new GoogleCloudStorageService();
export default gcsService;
