import AdsModel from "../Model/AdsModel.js";
import DepositeModel from "../Model/DepositeModel.js";
import UserModel from "../Model/UserModel.js";

export const watchAd = async (req, res) => {
  try {
    const userId = req.user._id; // logged in user
    const now = new Date();

    // Step 1: Check latest deposite with status 'active'
    const latestPurchase = await DepositeModel.findOne({
      user: userId,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .populate("plan");

    if (!latestPurchase) {
      return res.status(400).json({ message: "No active plan found." });
    }

    const plan = latestPurchase.plan;

    if (!plan || !plan.AdsEarnings) {
      return res
        .status(400)
        .json({ message: "Plan is invalid or missing AdsEarnings." });
    }

    const adsEarning = parseFloat(plan.AdsEarnings);

    // Step 2: Check if user already watched an ad in the last 24 hours
    const lastAdWatch = await AdsModel.findOne({ user: userId }).sort({
      watchedAt: -1,
    });

    if (lastAdWatch) {
      const timeDiff = now - new Date(lastAdWatch.watchedAt);
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        return res
          .status(400)
          .json({ message: "You can only watch one ad every 24 hours." });
      }
    }

    // Step 3: Add ad watch record
    const newAd = new AdsModel({
      user: userId,
      plan: plan._id,
      packagePurchase: latestPurchase._id,
      watchedDuration: 10, // assuming full ad watched (or get from req.body)
      earnedAmount: adsEarning,
    });

    await newAd.save();

    // Step 4: Update user's earnings
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.earnings += adsEarning;
    user.TotalEarnings += adsEarning;

    await user.save();

    return res.status(200).json({
      message: "Ad watched successfully. Earnings updated.",
      earned: adsEarning,
      totalEarnings: user.TotalEarnings,
    });
  } catch (error) {
    console.error("Error in watchAd:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const getUserAdStatsByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Step 1: Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    // Step 2: Find all ads watched by this user
    const userAds = await AdsModel.find({ user: user._id });

    const totalAdsWatched = userAds.length;
    const totalEarningsFromAds = userAds.reduce(
      (acc, ad) => acc + (ad.earnedAmount || 0),
      0
    );

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      totalAdsWatched,
      totalEarningsFromAds,
    });
  } catch (error) {
    console.error("Error in getUserAdStatsByEmail:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
