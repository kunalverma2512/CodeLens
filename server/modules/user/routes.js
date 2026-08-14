import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { csrfProtection } from "../../middlewares/csrfProtection.js";
import UserController from "./controller.js";
import { updateProfileSchema, validate } from "./validation.js";

const router = Router();

router.use(authMiddleware);
router.use(csrfProtection);

router.get("/profile", UserController.getProfile);
router.put("/profile", validate(updateProfileSchema), UserController.updateProfile);
router.delete("/profile", UserController.deleteAccount);

export default router;
