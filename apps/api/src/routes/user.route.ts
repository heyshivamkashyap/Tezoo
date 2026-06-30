import express, { Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { getUserProfile } from "../controllers/user.controller";

const router: Router = express.Router();

router.get("/profile", authenticate([]), getUserProfile);

export default router;
