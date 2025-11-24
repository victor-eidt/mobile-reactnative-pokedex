import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import PokedexScreen from './src/screens/PokedexScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import { RootStackParamList } from './src/types/navigation';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Pokedex"
          screenOptions={{
            headerTintColor: colors.text,
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: colors.background },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Pokedex" component={PokedexScreen} options={{ title: 'Pokédex' }} />
          <Stack.Screen
            name="PokemonDetail"
            component={PokemonDetailScreen}
            options={{ title: 'Detalhes' }}
          />
          <Stack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ title: 'Favoritos' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
