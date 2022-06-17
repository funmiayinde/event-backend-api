import { Response, Request, NextFunction } from 'express';
import { UNAUTHORIZED } from '../utils/codes';
import config from 'config';
import AppError from '../lib/app-error';

export default async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.body.api_key || req.headers['x-api-key'];
    if (!apiKey) {
        return next(new AppError('Api key absent', UNAUTHORIZED));
    }
    if (apiKey) {
        // use the default event api
        if (apiKey !== config.get('api.apiKey') && !(process.env.API_KEY.includes(apiKey))) {
            return next(new AppError('Invalid Api Key', UNAUTHORIZED));
        }
    }
    return next();
};
