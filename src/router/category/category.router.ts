import express from 'express';
import { categoryController }  from './index';
const router = express.Router();

router.get('/:slug', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);

export default router;