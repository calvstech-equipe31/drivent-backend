import { createClient } from 'redis';
import eventsService from '@/services/events-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getDefaultEvent(_req: Request, res: Response) {
  const redis = createClient({
    url: process.env.REDIS_URL,
  });
  await redis.connect();

  const cacheKey = 'eventConfig';

  try {
    const cachedEvent = await redis.get(cacheKey);
    console.log(cachedEvent);
    if (cachedEvent) {
      return res.status(httpStatus.OK).send(JSON.parse(cachedEvent));
    } else {
      const data = await eventsService.getFirstEvent();
      redis.set(cacheKey, JSON.stringify(data));
      return res.status(httpStatus.OK).send(data);
    }
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
