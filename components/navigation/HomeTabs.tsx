import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FavoriteScreen from '../../pages/FavoriteScreen';
import HomeScreen from '../../pages/HomeScreen';

const Tab = createBottomTabNavigator();
export default function HomeTabs() {
  return (
    <Tab.Navigator activeColor="#e91e63" barStyle={{ backgroundColor: 'tomato' }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          tabBarLabel: 'Favorite',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bell" color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  );
}
