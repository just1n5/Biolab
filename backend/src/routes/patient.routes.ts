import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => res.json({ message: 'Patient routes - To be implemented' }));
export default router;