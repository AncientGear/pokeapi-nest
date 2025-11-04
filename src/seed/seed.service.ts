import { Injectable } from '@nestjs/common';
import { PokeDetail, PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { AxiosAdapter } from '../common/providers/axios.provider';

@Injectable()
export class SeedService {

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ) {}

  async runSeed() {

    await this.pokemonService.deleteAll();

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonsToInsert: PokeDetail[] = [];
    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const pokemonNumber = +segments[segments.length - 2];
      pokemonsToInsert.push({ name: name.toUpperCase(), pokemonNumber });
    });
    try {

      await this.pokemonService.createMany(pokemonsToInsert);
    } catch (error) {
      console.error(`Error creating Pokémon:`, error);
    }
    return {
      message: 'Seed executed',
    };
  }
}
