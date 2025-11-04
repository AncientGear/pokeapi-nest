import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Type(() => Number)

    readonly limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    readonly offset?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    readonly sort?: -1 | 1;
}