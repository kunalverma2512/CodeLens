import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { csrfProtection } from "../../middlewares/csrfProtection.js";
import ContestController from "./controller.js";
import { validate, addReminderSchema } from "./validation.js";

const router = Router();

router.get("/codeforces/upcoming", ContestController.getUpcomingCodeforcesContests);

router.use(authMiddleware);
router.use(csrfProtection);

router.get("/reminders", ContestController.getReminderIds);
router.get("/reminders/active", ContestController.getActiveReminders);
router.post("/reminders", validate(addReminderSchema), ContestController.addReminder);
router.delete("/reminders/:contestId", ContestController.removeReminder);
router.post("/reminders/:contestId/notified", ContestController.markNotified);

export default router;
