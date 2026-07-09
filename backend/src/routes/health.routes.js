import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'verme-backend', time: new Date().toISOString() });
});

export default router;
