import mongoose from "mongoose";
const depositSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plane",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "failed"],
      default: "pending",
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("deposite", depositSchema);
