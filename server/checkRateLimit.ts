'use server'
import { apiIdToRequestCount, apiRateLimiter, AuthIdToRequestCount, authRateLimiter, likeIdToRequestCount, likeRateLimiter, postIdToRequestCount, postRateLimiter, rateLimit } from "@lib/rateLimit"
import { RateLimitObject } from "@lib/types";
import { headers } from "next/headers"
const getIpAddress = (): string => {
    return headers().get('x-forwarded-for') ?? 'unknown';
  };
  const checkRateLimit = async (
    rateLimiter: RateLimitObject,
    requestCount: Map<string, number>,
    action: string
  ): Promise<boolean> => {
    try {
      const ip = getIpAddress();
      const isRateLimited = rateLimit(ip, rateLimiter, requestCount);
      console.log(ip+' check '+action+rateLimiter.maxRequests+'/'+requestCount.get(ip))
      if (isRateLimited) {
        console.log(`${action} rate limit exceeded`);
      }
      
      return isRateLimited;
    } catch (error) {
      console.log(`Error while checking ${action} rate limit`, error);
      return false;
    }
  };

  export async function checkAuthRateLimit(): Promise<boolean> {
    return checkRateLimit(authRateLimiter, AuthIdToRequestCount, 'auth');
  }
  
  export async function checkLikeRateLimit(): Promise<boolean> {
    return checkRateLimit(likeRateLimiter, likeIdToRequestCount, 'like');
  }
  
  export async function checkApiRateLimit(): Promise<boolean> {
    return checkRateLimit(apiRateLimiter, apiIdToRequestCount, 'API request');
  }
  
  export async function checkPostRateLimit(): Promise<boolean> {
    return checkRateLimit(postRateLimiter, postIdToRequestCount, 'post');
  }


