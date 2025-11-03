import { IsInt, IsOptional, IsPositive, IsString, IsUUID, MaxLength, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsInt()
    @IsPositive()
    @Min(1)
    pokemonNumber: number;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;
}
