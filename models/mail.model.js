import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 100,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    sentEmail: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
  },
  { timestamps: true }
);

// export default mongoose.model("ContactMessage", ContactMessageSchema);

const ContactMessage = mongoose.model("ContactMessage", ContactMessageSchema)

export default ContactMessage;
