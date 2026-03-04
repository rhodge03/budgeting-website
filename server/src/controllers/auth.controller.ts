import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/v1/auth',
};

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, householdName } = req.body;
    const result = await authService.signup(email, password, householdName);

    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(201).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new UnauthorizedError('No refresh token');
    }

    const payload = verifyRefreshToken(token);
    const accessToken = generateAccessToken({
      userId: payload.userId,
      householdId: payload.householdId,
    });

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
  res.json({ message: 'Logged out' });
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
