import express from 'express';
import { authRouter } from './authentication';
import { userRouter } from './user';
import { blogRouter } from './blog';
import { commentRouter } from './comment';
import { verify } from '../middleware/authentication.middleware';


const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', verify, userRouter);
router.use('/blogs', blogRouter);
router.use('./blogs/:id/comments', commentRouter);

export default router;