import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import ScreenContainer from '../components/ScreenContainer';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorState from '../components/ErrorState';
import TypeBadge from '../components/TypeBadge';
import { RootStackParamList } from '../types/navigation';
import { getPokemonDetails } from '../services/pokeApi';
import { PokemonDetails } from '../types/pokemon';
import { colors } from '../theme/colors';
import { useFavorites } from '../context/FavoritesContext';

type Route = RouteProp<RootStackParamList, 'PokemonDetail'>;

const PokemonDetailScreen = () => {
  const route = useRoute<Route>();
  const { identifier } = route.params;
  const { toggleFavorite, isFavorite } = useFavorites();

  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetails();
  }, [identifier]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPokemonDetails(identifier);
      setPokemon(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!pokemon) return;
    toggleFavorite(pokemon);
  };

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingIndicator message="Buscando informações..." />
      </ScreenContainer>
    );
  }

  if (error || !pokemon) {
    return (
      <ScreenContainer>
        <ErrorState message={error ?? 'Pokémon não encontrado.'} actionLabel="Tentar novamente" onPressAction={fetchDetails} />
      </ScreenContainer>
    );
  }

  const favorite = isFavorite(pokemon.id);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: pokemon.imageUrl }} style={styles.image} />
        </View>
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.number}>#{String(pokemon.id).padStart(3, '0')}</Text>
          </View>
          <Pressable
            style={[styles.favoriteButton, favorite && styles.favoriteButtonActive]}
            onPress={handleToggleFavorite}
          >
            <Text
              style={[styles.favoriteButtonText, favorite && styles.favoriteButtonTextActive]}
            >
              {favorite ? '★' : '☆'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos</Text>
          <View style={styles.inlineList}>
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.inlineList}>
            {pokemon.abilities.map((ability) => (
              <View key={ability} style={styles.tag}>
                <Text style={styles.tagText}>{ability}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas básicas</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Altura</Text>
              <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Peso</Text>
              <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  imageWrapper: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 220,
    height: 220,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  nameContainer: {
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    textTransform: 'capitalize',
    color: colors.text,
  },
  number: {
    color: colors.mutedText,
    marginTop: 4,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexShrink: 0,
  },
  favoriteButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  favoriteButtonText: {
    fontSize: 24,
    color: colors.primary,
  },
  favoriteButtonTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  inlineList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    textTransform: 'capitalize',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    columnGap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    color: colors.mutedText,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});

export default PokemonDetailScreen;

