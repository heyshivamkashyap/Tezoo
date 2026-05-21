import express, { type Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller";
import { requireUser } from "../middleware/require-user.middleware";

const router: Router = express.Router();

// Register User
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

router.get("/logout", requireUser, logoutUser);

export default router;
