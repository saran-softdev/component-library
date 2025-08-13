/**
 * PMS Image Configuration
 * Defines sizes/quality per entity/image-type and provides folder structure helpers
 */

const IMAGE_CONFIGS = {
  // Hotel
  HOTEL_LOGO: {
    width: 220,
    height: 220,
    quality: 75,
    maxSize: 2 * 1024 * 1024,
    format: "webp",
  },
  HOTEL_COVER: {
    width: 1920,
    height: 600,
    quality: 70,
    maxSize: 5 * 1024 * 1024,
    format: "webp",
  },
  HOTEL_GALLERY: {
    width: 1600,
    height: 1200,
    quality: 72,
    maxSize: 5 * 1024 * 1024,
    format: "webp",
  },

  // RoomType
  ROOMTYPE_MAIN: {
    width: 1400,
    height: 1000,
    quality: 75,
    maxSize: 4 * 1024 * 1024,
    format: "webp",
  },
  ROOMTYPE_GALLERY: {
    width: 1400,
    height: 1000,
    quality: 72,
    maxSize: 4 * 1024 * 1024,
    format: "webp",
  },
  ROOMTYPE_THUMBNAIL: {
    width: 400,
    height: 300,
    quality: 70,
    maxSize: 2 * 1024 * 1024,
    format: "webp",
  },

  // Room
  ROOM_MAIN: {
    width: 1600,
    height: 1200,
    quality: 75,
    maxSize: 5 * 1024 * 1024,
    format: "webp",
  },
  ROOM_GALLERY: {
    width: 1600,
    height: 1200,
    quality: 72,
    maxSize: 5 * 1024 * 1024,
    format: "webp",
  },

  // Amenity
  AMENITY_ICON: {
    width: 128,
    height: 128,
    quality: 80,
    maxSize: 512 * 1024,
    format: "webp",
  },

  // Rate plan
  RATEPLAN_IMAGE: {
    width: 1200,
    height: 800,
    quality: 72,
    maxSize: 3 * 1024 * 1024,
    format: "webp",
  },

  // User/Staff
  USER_AVATAR: {
    width: 256,
    height: 256,
    quality: 72,
    maxSize: 2 * 1024 * 1024,
    format: "webp",
  },
  STAFF_AVATAR: {
    width: 256,
    height: 256,
    quality: 72,
    maxSize: 2 * 1024 * 1024,
    format: "webp",
  },

  // Guest/Booking documents or review images
  DOCUMENT: {
    width: 1600,
    height: 1600,
    quality: 70,
    maxSize: 10 * 1024 * 1024,
    format: "webp",
  },
  REVIEW_PHOTO: {
    width: 1200,
    height: 1200,
    quality: 70,
    maxSize: 3 * 1024 * 1024,
    format: "webp",
  },

  // Default fallback
  DEFAULT: {
    width: 1200,
    height: 1200,
    quality: 70,
    maxSize: 5 * 1024 * 1024,
    format: "webp",
  },
};

/**
 * Get image configuration by key
 * @param {string} type
 */
export const getImageConfig = (type) => {
  if (!type) return IMAGE_CONFIGS.DEFAULT;
  const key = String(type).toUpperCase();
  return IMAGE_CONFIGS[key] || IMAGE_CONFIGS.DEFAULT;
};

/**
 * Build structured folder paths for each entity/image-type
 * @param {"hotel"|"roomType"|"room"|"user"|"staff"|"booking"|"guest"|"organization"|"amenity"|"ratePlan"|string} entityType
 * @param {string|number} entityId
 * @param {string} imageType
 */
export const getFolderStructure = (entityType, entityId, imageType) => {
  const baseMap = {
    hotel: "hotels",
    roomType: "room-types",
    room: "rooms",
    user: "users",
    staff: "staff",
    booking: "bookings",
    guest: "guests",
    organization: "organizations",
    amenity: "amenities",
    ratePlan: "rate-plans",
  };

  const imageTypeMap = {
    logo: "logo",
    cover: "cover",
    main: "main",
    gallery: "gallery",
    thumbnail: "thumbnails",
    document: "documents",
    icon: "icons",
  };

  const base = baseMap[entityType] || `${entityType}s`;
  const sub = imageTypeMap[imageType] || imageType || "main";
  const id = String(entityId || "misc");

  return {
    fileId: id,
    folder: base,
    subFolder: sub,
    fullPath: `${base}/${id}/${sub}`,
  };
};

/**
 * Validate file against the config
 * @param {File|{size:number,type:string}} file
 * @param {string} configType
 */
export const validateImageFile = (file, configType) => {
  const cfg = getImageConfig(configType);
  const errors = [];

  if (!file || typeof file.size !== "number" || !file.type) {
    errors.push("Invalid file object");
  }

  if (file?.size > cfg.maxSize) {
    errors.push(
      `File too large. Max ${(cfg.maxSize / (1024 * 1024)).toFixed(1)}MB`
    );
  }

  const allowed = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/heic",
    "image/heif",
    "image/tiff",
    "image/bmp",
  ];

  if (file && !allowed.includes(file.type)) {
    errors.push("Unsupported type. Use JPEG/PNG/WebP/AVIF/HEIC/HEIF/TIFF/BMP");
  }

  return { isValid: errors.length === 0, errors, config: cfg };
};

/**
 * Centralized WebP tuning
 * @param {"high"|"medium"|"low"} qualityLevel
 */
export const getWebPSettings = (qualityLevel = "medium") => {
  const settings = {
    high: {
      quality: 75,
      effort: 6,
      lossless: false,
      nearLossless: false,
      smartSubsample: true,
      reductionEffort: 6,
      alphaQuality: 100,
      method: 6,
    },
    medium: {
      quality: 70,
      effort: 6,
      lossless: false,
      nearLossless: false,
      smartSubsample: true,
      reductionEffort: 6,
      alphaQuality: 100,
      method: 6,
    },
    low: {
      quality: 65,
      effort: 6,
      lossless: false,
      nearLossless: false,
      smartSubsample: true,
      reductionEffort: 6,
      alphaQuality: 100,
      method: 6,
    },
  };
  return settings[qualityLevel] || settings.medium;
};

export default IMAGE_CONFIGS;
