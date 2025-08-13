import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    label: { type: String, default: "" },
    category: {
      type: String,
      enum: ["exterior", "interior", "room", "amenity", "food", "other"],
      default: "other",
    },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const CoordinatesSchema = new mongoose.Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    coordinates: { type: CoordinatesSchema, default: undefined },
  },
  { _id: false }
);

const ContactSchema = new mongoose.Schema(
  {
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    website: { type: String, default: "" },
    fax: { type: String, default: "" },
  },
  { _id: false }
);

const CapacitySchema = new mongoose.Schema(
  {
    totalRooms: { type: Number, default: 0 },
    totalFloors: { type: Number, default: 0 },
    maxOccupancy: { type: Number, default: 0 },
  },
  { _id: false }
);

const OperatingHoursSchema = new mongoose.Schema(
  {
    checkIn: { type: String, default: "15:00" },
    checkOut: { type: String, default: "11:00" },
    frontDesk: {
      open: { type: String, default: "00:00" },
      close: { type: String, default: "23:59" },
    },
  },
  { _id: false }
);

const PoliciesSchema = new mongoose.Schema(
  {
    cancellation: {
      freeUptoHours: { type: Number, default: 24 },
      penaltyPercentage: { type: Number, default: 0 },
    },
    payment: {
      advancePayment: { type: Number, default: 0 },
      acceptedMethods: { type: [String], default: [] },
      currency: { type: String, default: "INR" },
    },
    pet: {
      allowed: { type: Boolean, default: false },
      charges: { type: Number, default: 0 },
    },
    smoking: {
      allowed: { type: Boolean, default: false },
      areas: { type: [String], default: [] },
    },
    children: {
      freeUptoAge: { type: Number, default: 12 },
      extraBedCharges: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const HotelSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },

    description: { type: String, default: "" }, // store sanitized HTML
    shortDescription: { type: String, default: "" },
    category: {
      type: String,
      enum: [
        "luxury",
        "business",
        "budget",
        "boutique",
        "resort",
        "motel",
        "hostel",
        "apartment",
      ],
      default: "business",
    },
    starRating: { type: Number, min: 1, max: 5, default: 3 },

    address: { type: AddressSchema, default: undefined },
    contact: { type: ContactSchema, default: undefined },
    images: { type: [ImageSchema], default: [] },

    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity" }],
    facilities: [
      { name: { type: String }, charge: { type: Number, default: 0 } },
    ],

    capacity: { type: CapacitySchema, default: undefined },
    operatingHours: { type: OperatingHoursSchema, default: undefined },
    policies: { type: PoliciesSchema, default: undefined },

    // Soft-delete + audit
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    restoredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    restoredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Filters: exclude soft-deleted by default
HotelSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("isDeleted")) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// Indexes
HotelSchema.index({ organizationId: 1, slug: 1 }, { unique: true });
HotelSchema.index({ name: "text", "address.city": 1 });

const Hotel = mongoose.models.Hotel || mongoose.model("Hotel", HotelSchema);

export default Hotel;
