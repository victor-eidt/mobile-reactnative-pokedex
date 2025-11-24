export type PokemonIdentifier = number | string;

export type PokemonSummary = {
  id: number;
  name: string;
  imageUrl: string;
};

export type PokemonDetails = PokemonSummary & {
  types: string[];
  abilities: string[];
  height: number;
  weight: number;
};

export type PaginatedPokemonResponse = {
  results: PokemonSummary[];
  nextOffset: number | null;
};

