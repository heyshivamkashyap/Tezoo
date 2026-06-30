import express, { type Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate.middleware";

const router: Router = express.Router();

// Register User
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

router.get("/logout", authenticate(["customer"]), logoutUser);

router.get("/refresh-token", refreshAccessToken);

export default router;
