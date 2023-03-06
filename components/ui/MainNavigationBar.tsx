import { Appbar } from 'react-native-paper';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import { ScreenProps } from 'react-native-screens';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { isString } from '../../utils/typeChecker';

export default function MainNavigationBar({
  navigation,
  options,
  route,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
  options: NativeStackNavigationOptions;
  route: RouteProp<ParamListBase>;
}) {
  const customBackRoutes: Record<string, string> = {
    'Add product': 'Select method',
  };

  const title = isString(options?.headerTitle) || route.name;
  const backCallback = customBackRoutes[route.name]
    ? () => navigation.navigate(customBackRoutes[route.name])
    : navigation.goBack;
  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={backCallback} />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
