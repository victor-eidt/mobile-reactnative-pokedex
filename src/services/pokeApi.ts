import axios from 'axios';
import {
  PaginatedPokemonResponse,
  PokemonDetails,
  PokemonIdentifier,
  PokemonSummary,
} from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const DEFAULT_LIMIT = 20;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
});

const getPokemonIdFromUrl = (url: string) => {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? Number(matches[1]) : 0;
};

const getOfficialArtworkUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const normalizePokemonSummary = (pokemon: { name: string; url: string }): PokemonSummary => {
  const id = getPokemonIdFromUrl(pokemon.url);
  return {
    id,
    name: pokemon.name,
    imageUrl: getOfficialArtworkUrl(id),
  };
};

export const getPokemonPage = async (
  offset = 0,
  limit = DEFAULT_LIMIT,
): Promise<PaginatedPokemonResponse> => {
  try {
    const { data } = await api.get('/pokemon', {
      params: { offset, limit },
    });

    return {
      results: data.results.map(normalizePokemonSummary),
      nextOffset: data.next ? offset + limit : null,
    };
  } catch (error) {
    throw new Error('Não foi possível carregar a lista de Pokémon.');
  }
};

export const getPokemonDetails = async (
  identifier: PokemonIdentifier,
): Promise<PokemonDetails> => {
  try {
    const { data } = await api.get(`/pokemon/${identifier}`);

    const imageUrl =
      data.sprites?.other?.['official-artwork']?.front_default ??
      data.sprites?.front_default ??
      getOfficialArtworkUrl(data.id);

    return {
      id: data.id,
      name: data.name,
      imageUrl,
      types: data.types.map((item: any) => item.type.name),
      abilities: data.abilities.map((item: any) => item.ability.name),
      height: data.height,
      weight: data.weight,
    };
  } catch (error) {
    throw new Error('Pokémon não encontrado. Confira o nome ou número informado.');
  }
};

