import { z } from 'zod';

export const createNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    message: z.string(),
    userId: z.string().uuid(),
  }),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>['body'];
