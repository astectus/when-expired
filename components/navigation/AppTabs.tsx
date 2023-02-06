import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FavoriteScreen from '../../pages/FavoriteScreen';
import AppStacks from './AppStacks';

const Tab = createMaterialBottomTabNavigator();
export default function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#e91e63"
      barStyle={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="StackRoutes"
        component={AppStacks}
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
