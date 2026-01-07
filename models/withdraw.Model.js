import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 100,
      max: 500000,
    },

    method: {
      type: String,
      enum: ["bank", "easypaisa", "jazzcash", "payoneer", "sadapay"],
      required: true,
    },

    accountDetails: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      validate: {
        validator: function (value) {
          // Method-based validation
          switch (this.method) {
            // Pakistan IBAN (example: PK36SCBL0000001123456702)
            case "bank":
              return /^PK\d{2}[A-Z]{4}\d{16}$/.test(value);

            // Pakistan mobile wallets
            case "easypaisa":
            case "jazzcash":
            case "sadapay":
              return /^03\d{9}$/.test(value);

            // Payoneer email
            case "payoneer":
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

            default:
              return false;
          }
        },
        message: "Invalid account details for selected withdrawal method",
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // transactionId: {
    //   type: String,
    //   trim: true,
    //   maxlength: 50,
    //   match: /^[A-Za-z0-9_-]+$/,
    // },

    // adminNote: {
    //   type: String,
    //   trim: true,
    //   maxlength: 300,
    // },

    // balanceSnapshot: {
    //   type: Number,
    //   required: true,
    // },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Indexes for performance & security
withdrawSchema.index({ user: 1, status: 1 });
withdrawSchema.index({ createdAt: -1 });

export default mongoose.model("Withdraw", withdrawSchema);
