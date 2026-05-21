import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { authSubject } from './middleware';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.auth?.payload;

  res.json({
    status: 'success',
    data: {
      user: {
        sub: authSubject(req),
        email: payload?.email ?? null,
        name: payload?.name ?? null,
        picture: payload?.picture ?? null,
      },
      tenantId: req.siteConfig.tenantId,
    },
  });
});
