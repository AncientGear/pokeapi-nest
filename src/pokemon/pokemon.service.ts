import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ){}
  
  async create(createPokemonDto: CreatePokemonDto) {
    try {

      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const createdPokemon = new this.pokemonModel(createPokemonDto);
      return await createdPokemon.save();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async createMany(pokemons: CreatePokemonDto[]) {
    try {
      return await this.pokemonModel.insertMany(pokemons);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(params: PaginationDto) {
    const { limit = 10, offset = 0, sort = 1 } = params;
    return await this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({ pokemonNumber: sort });
  }

  async findOne(term: string) {
     const pokemon = await this.pokemonModel.findOne({
      $or: [
        ...(!isNaN(+term) ? [{ pokemonNumber: term }] : []),
        ...(isValidObjectId(term) ? [{ _id: term }] : []),
        { name: { $regex: `.*${term.trim()}.*`, $options: 'i' }, },
      ],
    });
 
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or pokemonNumber ${term} not found`,
      );
 
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    
    try {
      const pokemon = await this.findOne(id);

      await this.pokemonModel.updateOne({ _id: pokemon._id }, { $set: updatePokemonDto }).exec();

      return {...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async deleteOneById(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: id
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Pokemon with id ${id} not found for deletion`);
    }

    return {
      message: "Pokemon deleted successfully"
    };
  }

  async deleteAll() {
    const result = await this.pokemonModel.deleteMany({});
    return result;
  }

  private handleExceptions(error: any) {
    
    if (error.code === 11000) {
      throw new NotFoundException(`Pokemon already exists in db: ${JSON.stringify(error.keyValue)}`);
    }
    
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
