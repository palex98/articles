import { Article } from '../models/Article';
import AppDataSource from '../config/ormconfig';
import { SelectQueryBuilder } from 'typeorm';
import { GetArticlesDto } from '../dtos/GetArticles.dto';

export class ArticleService {
    static async getArticles(queryParams: GetArticlesDto) {
        const repository = AppDataSource.getRepository(Article);
        const queryBuilder = repository.createQueryBuilder('article');

        this.applyFilters(queryBuilder, queryParams);

        this.applySorting(queryBuilder, queryParams.sortBy, queryParams.order);
        const pagination = this.applyPagination(queryBuilder, queryParams.page, queryParams.limit);

        const [articles, total] = await queryBuilder.getManyAndCount();

        return {
            page: pagination.currentPage,
            limit: pagination.pageSize,
            total,
            data: articles,
        };
    }

    private static applyFilters(
        queryBuilder: SelectQueryBuilder<Article>,
        filters: Partial<GetArticlesDto>
    ) {
        const { title, author, tags, status, from, to, minViews, maxViews } = filters;

        if (title) {
            queryBuilder.andWhere('article.title ILIKE :title', { title: `%${title}%` });
        }

        if (author) {
            queryBuilder.andWhere('article.author = :author', { author });
        }

        if (status) {
            queryBuilder.andWhere('article.status = :status', { status });
        }

        if (from && to) {
            queryBuilder.andWhere('article.createdAt BETWEEN :from AND :to', {
                from: new Date(from),
                to: new Date(to),
            });
        }

        if (minViews) {
            queryBuilder.andWhere('article.views >= :minViews', { minViews });
        }

        if (maxViews) {
            queryBuilder.andWhere('article.views <= :maxViews', { maxViews });
        }

        if (tags) {
            queryBuilder
                .innerJoin('article.tags', 'tag')
                .andWhere('tag.name IN (:...tags)', { tags });
        } else {
            queryBuilder.leftJoinAndSelect('article.tags', 'tag');
        }
    }

    private static applySorting(
        queryBuilder: SelectQueryBuilder<Article>,
        sortBy: string,
        order: string
    ) {
        const allowedSortOrder: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
        const sortOrder = allowedSortOrder.includes(order.toUpperCase() as 'ASC' | 'DESC')
            ? (order.toUpperCase() as 'ASC' | 'DESC')
            : 'ASC';

        queryBuilder.orderBy(`article.${sortBy}`, sortOrder);
    }

    private static applyPagination(
        queryBuilder: SelectQueryBuilder<Article>,
        page: number,
        limit: number
    ) {
        const currentPage = Math.max(page, 1);
        const pageSize = Math.max(limit, 1);

        queryBuilder.skip((currentPage - 1) * pageSize).take(pageSize);

        return { currentPage, pageSize };
    }
}
