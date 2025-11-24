import { PokemonIdentifier } from './pokemon';

export type RootStackParamList = {
  Pokedex: undefined;
  PokemonDetail: {
    identifier: PokemonIdentifier;
  };
  Favorites: undefined;
};

