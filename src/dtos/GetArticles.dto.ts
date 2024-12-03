import {
    IsOptional,
    IsString,
    IsNumber,
    IsIn,
    IsArray,
    IsDateString,
    Min,
    Max,
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetArticlesDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value
                .split(',')
                .map((tag: string) => tag.trim())
                .filter(Boolean)
            : value,
    )
    tags?: string[];

    @IsOptional()
    @IsString()
    @IsIn(['published', 'draft', 'archived'])
    status?: string;

    @IsOptional()
    @IsDateString()
    from?: string;

    @IsOptional()
    @IsDateString()
    @IsFromBeforeTo('from', { message: '"from" date must be earlier than "to" date.' })
    to?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(0)
    minViews?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(0)
    @IsMinViewsLessThanMaxViews('minViews', {
        message: '"minViews" must be less than or equal to "maxViews".',
    })
    maxViews?: number;

    @IsOptional()
    @IsString()
    @IsIn(['createdAt', 'updatedAt', 'views', 'title'])
    sortBy: string = 'createdAt';

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC' = 'ASC';

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(1)
    @Max(100)
    limit: number = 10;
}

function IsFromBeforeTo(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsFromBeforeTo',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(toValue: any, args: ValidationArguments) {
                    const [fromProperty] = args.constraints;
                    const fromValue = (args.object as any)[fromProperty];
                    if (fromValue && toValue) {
                        return new Date(fromValue) <= new Date(toValue);
                    }
                    return true;
                },
            },
        });
    };
}

function IsMinViewsLessThanMaxViews(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsMinViewsLessThanMaxViews',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(maxViewsValue: any, args: ValidationArguments) {
                    const [minViewsProperty] = args.constraints;
                    const minViewsValue = (args.object as any)[minViewsProperty];
                    if (
                        minViewsValue !== undefined &&
                        maxViewsValue !== undefined
                    ) {
                        return minViewsValue <= maxViewsValue;
                    }
                    return true;
                },
            },
        });
    };
}
