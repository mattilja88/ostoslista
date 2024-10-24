import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ostoslista from './pages/shoppingList'; 
import HomeScreen from './pages/Home';
import { TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

function showInfoAlert() {
  Alert.alert(
    "Info",
    "Poista ostoslista roskakorinapilla\n\nOstolistassa\n\nLyhyt painallus -> Ostos tehty\nPitkä painallus -> Poista ostos listasta",
    [{ text: "OK" }] 
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerRight: () => (
            <TouchableOpacity onPress={showInfoAlert} style={{ paddingRight: 16 }}>
              <Icon name="info-circle" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen name="Etusivu" component={HomeScreen} />
        <Stack.Screen name="Ostoslista" component={Ostoslista} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
