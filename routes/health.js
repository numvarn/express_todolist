const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// GET /api/health - Backend health check
router.get('/', (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: require('../package.json').version,
      server: {
        nodejs: process.version,
        platform: process.platform,
        architecture: process.arch,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
          external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
        }
      }
    };

    res.status(200).json({
      success: true,
      message: 'Backend is healthy',
      data: healthStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// GET /api/health/database - Database connection status
router.get('/database', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    let dbStatus = {
      status: dbStates[dbState] || 'unknown',
      state: dbState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };

    if (dbState === 1) {
      const startTime = Date.now();
      await mongoose.connection.db.admin().ping();
      const responseTime = Date.now() - startTime;

      dbStatus.responseTime = `${responseTime}ms`;
      dbStatus.collections = await mongoose.connection.db.listCollections().toArray();
      dbStatus.collectionsCount = dbStatus.collections.length;
    }

    const isHealthy = dbState === 1;

    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      message: isHealthy ? 'Database connection is healthy' : 'Database connection is unhealthy',
      data: {
        database: dbStatus,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database health check failed',
      error: error.message,
      data: {
        database: {
          status: 'error',
          state: mongoose.connection.readyState
        },
        timestamp: new Date().toISOString()
      }
    });
  }
});

// GET /api/health/detailed - Comprehensive health check
router.get('/detailed', async (req, res) => {
  try {
    const startTime = Date.now();

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: require('../package.json').version,
      server: {
        nodejs: process.version,
        platform: process.platform,
        architecture: process.arch,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
          external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100,
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100
        }
      }
    };

    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    let dbStatus = {
      status: dbStates[dbState] || 'unknown',
      state: dbState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };

    if (dbState === 1) {
      try {
        const dbStartTime = Date.now();
        await mongoose.connection.db.admin().ping();
        const dbResponseTime = Date.now() - dbStartTime;

        dbStatus.responseTime = `${dbResponseTime}ms`;
        dbStatus.collections = await mongoose.connection.db.listCollections().toArray();
        dbStatus.collectionsCount = dbStatus.collections.length;
      } catch (dbError) {
        dbStatus.error = dbError.message;
        healthData.status = 'degraded';
      }
    } else {
      healthData.status = 'unhealthy';
    }

    healthData.database = dbStatus;
    healthData.responseTime = `${Date.now() - startTime}ms`;

    const statusCode = healthData.status === 'healthy' ? 200 :
                      healthData.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json({
      success: healthData.status !== 'unhealthy',
      message: `System status: ${healthData.status}`,
      data: healthData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Detailed health check failed',
      error: error.message,
      data: {
        status: 'error',
        timestamp: new Date().toISOString()
      }
    });
  }
});

module.exports = router;