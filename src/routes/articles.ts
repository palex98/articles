import { Router, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ArticleService } from '../services/ArticleService';
import { GetArticlesDto } from '../dtos/GetArticles.dto';

const router = Router();

async function validateDto<T extends object>(dtoClass: new () => T, data: any): Promise<T> {
    const dto = plainToInstance(dtoClass, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
        const errorMessages = errors
            .map(err => Object.values(err.constraints || {}).join(', '))
            .join('; ');
        throw new Error(`Validation failed: ${errorMessages}`);
    }

    return dto;
}

router.get('/', async (req: Request, res: Response) => {
    try {
        const validatedDto = await validateDto<GetArticlesDto>(GetArticlesDto, req.query);

        const articles = await ArticleService.getArticles(validatedDto);

        return res.status(200).json(articles);
    } catch (error) {
        if (error instanceof Error) {
            const statusCode = error.message.startsWith('Validation failed') ? 400 : 500;
            return res.status(statusCode).json({ message: error.message });
        }

        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
});

export default router;
