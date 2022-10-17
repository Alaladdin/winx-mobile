import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import theme from '@/theme';

export function BarsScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <ScrollView style={ styles.container } contentContainerStyle={ [styles.container, styles.containerContent] }>
      <TextInput
        style={ styles.input }
        label="Login"
        value={ username }
        disabled
        onChangeText={ setUsername }
      />

      <TextInput
        style={ styles.input }
        label="Password"
        value={ password }
        disabled
        onChangeText={ setPassword }
      />

      <Button mode="elevated" disabled>
        Login
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width    : '100%',
    minHeight: '100%',
  },
  containerContent: {
    flexDirection : 'column',
    justifyContent: 'center',
    padding       : theme.spacing.large,
  },
  input: {
    marginBottom: theme.spacing.medium,
  },
});
