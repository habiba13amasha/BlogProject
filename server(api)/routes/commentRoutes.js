import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { createComment,getPostComments,likeComment,editComment ,deleteComment,getComments} from "../controllers/commentController.js"

const router=express.Router()

router.post("/create-comment",verifyToken,createComment)
router.get("/getPostComments/:postId",getPostComments)
router.put("/likeComment/:commentId",verifyToken,likeComment)
router.put("/editComment/:commentId",verifyToken,editComment)
router.delete("/deleteComment/:commentId",verifyToken,deleteComment)
router.get("/getComments",verifyToken,getComments)

export default router
