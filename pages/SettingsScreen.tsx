import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Text, Switch, List, Divider } from 'react-native-paper';
import { usePreferences } from '../context/PreferencesContext';

const SettingsScreen = () => {
  const theme = useTheme();
  const { isThemeDark, toggleTheme } = usePreferences();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <List.Item
          title="Dark Theme"
          description="Toggle between light and dark mode"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={isThemeDark}
              onValueChange={toggleTheme}
              color={theme.colors.primary}
            />
          )}
        />
        <Divider />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default SettingsScreen;
