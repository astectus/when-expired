import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { ReactElement } from 'react';
import { MARGIN_STATUSBAR_TOP } from '../../constants/screenConstants';

const { statusBarHeight } = Constants;
export default function NoHeaderScreen({ children }: { children: ReactElement }) {
  return <View style={styles.screenContainer}>{children}</View>;
}

const styles = StyleSheet.create({
  screenContainer: {
    marginTop: statusBarHeight + MARGIN_STATUSBAR_TOP,
  },
});
