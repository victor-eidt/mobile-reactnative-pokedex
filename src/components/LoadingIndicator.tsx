import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type LoadingIndicatorProps = {
  message?: string;
};

const LoadingIndicator = ({ message }: LoadingIndicatorProps) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
    {message ? <Text style={styles.text}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  text: {
    marginTop: 12,
    color: colors.mutedText,
  },
});

export default LoadingIndicator;

