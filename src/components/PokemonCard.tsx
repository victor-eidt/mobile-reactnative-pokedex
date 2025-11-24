import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PokemonSummary } from '../types/pokemon';
import { colors } from '../theme/colors';

type PokemonCardProps = {
  pokemon: PokemonSummary;
  onPress: () => void;
};

const PokemonCard = ({ pokemon, onPress }: PokemonCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.imageWrapper}>
      <Image source={{ uri: pokemon.imageUrl }} style={styles.image} resizeMode="contain" />
    </View>
    <Text style={styles.name}>{pokemon.name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    margin: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  name: {
    marginTop: 8,
    textTransform: 'capitalize',
    fontWeight: '600',
    color: colors.text,
  },
});

export default PokemonCard;

