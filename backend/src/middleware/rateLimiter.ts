import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, RateLimitBucket>();
const CAPACITY = 300; // 300 requests
const REFILL_RATE_PER_SECOND = 10; // 10 tokens/sec

/**
 * Enterprise Token-Bucket Rate Limiter per Tenant
 */
export function tenantRateLimiter(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const tenantKey = req.tenantId || req.ip || 'anonymous';
  const now = Date.now();

  let bucket = buckets.get(tenantKey);
  if (!bucket) {
    bucket = { tokens: CAPACITY, lastRefill: now };
    buckets.set(tenantKey, bucket);
  }

  // Refill tokens
  const elapsedSeconds = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsedSeconds * REFILL_RATE_PER_SECOND);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    res.setHeader('X-RateLimit-Limit', CAPACITY);
    res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));
    next();
  } else {
    res.status(429).json({
      success: false,
      error: 'Too Many Requests - Tenant rate limit exceeded. Please throttle API requests.',
    });
  }
}
