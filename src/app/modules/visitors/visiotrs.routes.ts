import { Router } from "express";
import { VisitorController } from "./visiotrs.controller";

const router = Router();

router.post("/", VisitorController.createVisiotr);

export const visitorRoutes = router;
