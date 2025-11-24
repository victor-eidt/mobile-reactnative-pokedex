import { StyleSheet, Text, View } from 'react-native';
import { colors, typeColors } from '../theme/colors';

type TypeBadgeProps = {
  type: string;
};

const TypeBadge = ({ type }: TypeBadgeProps) => {
  const backgroundColor = typeColors[type] ?? colors.accent;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>{type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    color: '#fff',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
});

export default TypeBadge;

