import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type ErrorStateProps = {
  message: string;
  actionLabel?: string;
  onPressAction?: () => void;
  footer?: ReactNode;
};

const ErrorState = ({ message, actionLabel, onPressAction, footer }: ErrorStateProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>Ops!</Text>
    <Text style={styles.message}>{message}</Text>
    {actionLabel && onPressAction ? (
      <Pressable style={styles.button} onPress={onPressAction}>
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </Pressable>
    ) : null}
    {footer}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    color: colors.mutedText,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ErrorState;

