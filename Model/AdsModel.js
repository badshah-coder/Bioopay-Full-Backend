import mongoose from "mongoose";

const adWatchSchema = new mongoose.Schema({
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
  packagePurchase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deposite", // jo package user ne activate kiya
    required: true,
  },
  watchedDuration: {
    type: Number, // seconds
    required: true,
  },

  earnedAmount: {
    type: Number,
    default: 0,
  },
  watchedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ads", adWatchSchema);
