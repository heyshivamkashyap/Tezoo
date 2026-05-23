import express, { type Router } from "express";
import { requireUser } from "../middleware/require-user.middleware";
import {
  createAddress,
  deleteAddress,
  getUserAddresses,
  setDefaultAddress,
  updateAddress,
} from "../controllers/address.controller";

const router: Router = express.Router();

// Create address route
router.post("/create", requireUser, createAddress);

// get user all addresses
router.get("/get", requireUser, getUserAddresses);

// Update address route
router.patch("/update/:addressId", requireUser, updateAddress);

// Set default address
router.patch("/default/:addressId", requireUser, setDefaultAddress);

// delete address
router.delete("/delete/:addressId", requireUser, deleteAddress);

export default router;
