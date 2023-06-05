import express from 'express';
import { getPosts, addPosts, deletePost } from '../controllers/post.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', addPosts);
router.delete('/:id', deletePost);

export default router;
