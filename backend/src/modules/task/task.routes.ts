import { Router } from "express";
import * as taskController from "./task.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, taskController.create);
router.get("/", authenticate, taskController.getAll);
router.patch("/:id", authenticate, taskController.update);
router.delete("/:id", authenticate, taskController.remove);

router.post("/:id/toggle", authenticate, taskController.toggle);

export default router;
