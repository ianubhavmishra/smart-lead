import express from 'express';
import { createBatch, getLeads } from '../controllers/leadController.js';

const router = express.Router();

router.post('/', createBatch);
router.get('/', getLeads);

export default router;
