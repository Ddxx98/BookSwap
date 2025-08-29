import express from "express"
import requestController from "../controllers/request.js"
import { verifyTokenMiddleware } from "../middleware/middleware.js"

const router = express.Router()

router.post("/requests", verifyTokenMiddleware, requestController.createRequest)
router.get("/requests/mine", verifyTokenMiddleware, requestController.getMyRequests)
router.get("/requests/incoming", verifyTokenMiddleware, requestController.getIncomingRequests)
router.patch("/requests/:id", verifyTokenMiddleware, requestController.updateRequestStatus)

export default router