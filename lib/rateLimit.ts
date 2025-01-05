import { RateLimitObject } from "./types";

export const likeIdToRequestCount = new Map<string, number>(); // keeps track of individual users
export const verifyRequestCount = new Map<string,number>();
export const postIdToRequestCount = new Map<string,number>();
export const apiIdToRequestCount = new Map<string,number>();
export const AuthIdToRequestCount = new Map<string,number>();


export const likeRateLimiter:RateLimitObject = {
  windowStart: Date.now(),
  windowDuration: 1000*60, // Milliseconds (currently 1 Hour) 
  maxRequests: 10,
};

export const verifyRateLimiter:RateLimitObject = {
  windowStart: Date.now(),
  windowDuration: 1000*60, // Milliseconds (currently 1 Hour) 
  maxRequests: 4,
};


export const postRateLimiter:RateLimitObject = {
  windowStart: Date.now(),
  windowDuration: 1000*60, // Milliseconds (currently 1 Hour) 
  maxRequests: 10,
};

export const authRateLimiter:RateLimitObject = {
  windowStart: Date.now(),
  windowDuration: 1000*60*60, // Milliseconds (currently 1 Hour)
  maxRequests: 5,
}
export const apiRateLimiter:RateLimitObject = {
  windowStart: Date.now(),
  windowDuration: 1000*10, // Milliseconds (currently 1 Hour)
  maxRequests: 50,
}

export const rateLimit = (ip: string,rateLimiter:RateLimitObject,requestCount:Map<string,number>) => {

  // Check and update current window
  const now = Date.now();
  const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowDuration;
  if (isNewWindow) {
    rateLimiter.windowStart = now;
    requestCount.set(ip, 0);
  }

  // Check and update current request limits
  const currentRequestCount = requestCount.get(ip) ?? 0;
  if (currentRequestCount >= rateLimiter.maxRequests) return true;
  requestCount.set(ip, currentRequestCount + 1);

  return false;
};