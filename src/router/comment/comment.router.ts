import express from 'express';
import { verify } from '../../middleware/';
import commentController from './comment.controller';
const router = express.Router();

router.get('/:blogId/comments', commentController.getComments);
router.post('/:blogId/comments', verify ,commentController.createComment)
router.patch('/comments/:commentId', commentController.updateComment)
router.delete('/comments/:commentId',commentController.deleteComment);

export default router;