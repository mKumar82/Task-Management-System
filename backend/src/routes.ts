import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/task/task.routes";

const router = Router();


router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);

router.get("/test", (_req, res) => {
  res.json({ message: "API working fine" });
});

export default router;
