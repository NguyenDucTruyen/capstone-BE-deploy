import express from 'express';
import { commentController } from './index'
const router = express.Router();

router.get('/', commentController.getCommentsByBlogId);
router.post('/', commentController.postComment);
router.patch('/:id', commentController.updateComment);

export default router;