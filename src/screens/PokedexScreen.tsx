import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import ScreenContainer from '../components/ScreenContainer';
import PokemonCard from '../components/PokemonCard';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorState from '../components/ErrorState';
import { getPokemonDetails, getPokemonPage } from '../services/pokeApi';
import { PokemonSummary } from '../types/pokemon';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Pokedex'>;

const PokedexScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadPokemon();
  }, []);

  const loadPokemon = async (offset = 0, append = false) => {
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);

    try {
      const response = await getPokemonPage(offset);
      setPokemonList((prev) => (append ? [...prev, ...response.results] : response.results));
      setNextOffset(response.nextOffset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar a Pokédex.');
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (nextOffset === null || loadingMore) return;
    loadPokemon(nextOffset, true);
  };

  const handleSearch = async () => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed || searching) {
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const pokemon = await getPokemonDetails(trimmed);
      navigation.navigate('PokemonDetail', { identifier: pokemon.id });
      setSearchQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pokémon não encontrado.');
    } finally {
      setSearching(false);
    }
  };

  const renderItem = ({ item }: { item: PokemonSummary }) => (
    <PokemonCard
      pokemon={item}
      onPress={() => navigation.navigate('PokemonDetail', { identifier: item.id })}
    />
  );

  if (loading && pokemonList.length === 0) {
    return (
      <ScreenContainer>
        <LoadingIndicator message="Carregando Pokédex..." />
      </ScreenContainer>
    );
  }

  if (error && pokemonList.length === 0) {
    return (
      <ScreenContainer>
        <ErrorState message={error} actionLabel="Tentar novamente" onPressAction={() => loadPokemon()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable style={styles.favoritesButton} onPress={() => navigation.navigate('Favorites')}>
          <Text style={styles.favoritesButtonText}>Favoritos</Text>
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pokédex Explorer</Text>
          <Text style={styles.subtitle}>Descubra Pokémon, busque e marque seus favoritos.</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Nome ou número"
          placeholderTextColor={colors.mutedText}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          style={[styles.searchButton, searching && { opacity: 0.7 }]}
          onPress={handleSearch}
          disabled={searching}
        >
          <Text style={styles.searchButtonText}>{searching ? 'Buscando...' : 'Buscar'}</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.inlineError}>{error}</Text> : null}

      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          nextOffset !== null ? (
            <View style={styles.footer}>
              <Pressable
                style={[styles.loadMoreButton, loadingMore && styles.loadMoreButtonDisabled]}
                onPress={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loadMoreButtonText}>Carregar mais</Text>
                )}
              </Pressable>
            </View>
          ) : null
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  titleContainer: {
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    color: colors.mutedText,
  },
  favoritesButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  favoritesButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  inlineError: {
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: colors.text,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  loadMoreButtonDisabled: {
    opacity: 0.7,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default PokedexScreen;

