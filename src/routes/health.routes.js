import { Router } from 'express';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Exposes internal structural application and environment system states
 * @access  Public (Infrastructure Probe)
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime() // Tracks process lifecycle operational metrics in seconds
  });
});

export const healthRoutes = router;