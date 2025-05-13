import express from "express";

import { getUserAdStatsByEmail, watchAd } from "../Controller/AdsController.js";
import { isAdmin, requireSignIn } from "../middleware/UserMiddleware.js";

const router = express.Router();

router.post("/watch-ad", requireSignIn, watchAd);

router.post("/get-user-ads", requireSignIn, getUserAdStatsByEmail);

export default router;
