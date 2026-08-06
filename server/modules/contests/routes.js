import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import ContestController from "./controller.js";
import { validate, validateParams, addReminderSchema, contestIdParamSchema } from "./validation.js";

const router = Router();

router.get("/codeforces/upcoming", ContestController.getUpcomingCodeforcesContests);

router.use(authMiddleware);

router.get("/reminders", ContestController.getReminderIds);
router.get("/reminders/active", ContestController.getActiveReminders);
router.post("/reminders", validate(addReminderSchema), ContestController.addReminder);
router.delete(
  "/reminders/:contestId",
  validateParams(contestIdParamSchema),
  ContestController.removeReminder
);
router.post(
  "/reminders/:contestId/notified",
  validateParams(contestIdParamSchema),
  ContestController.markNotified
);

export default router;
