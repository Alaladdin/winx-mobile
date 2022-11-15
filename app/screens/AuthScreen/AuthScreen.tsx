import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { api } from '@/services/api';
import { useStores } from '@/models';

export function AuthScreen({ navigation }) {
  const { authStore } = useStores();
  const [username, setUsername] = useState<string>(authStore.lastUsername);
  const [password, setPassword] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const isFormDisabled = useMemo(() => isAuthenticating || isRegistering, [isAuthenticating, isRegistering]);
  const isButtonsDisabled = useMemo(() => isFormDisabled || !username || !password, [isFormDisabled, username, password]);

  useEffect(() => {
    setIsError(false);
  }, [username, password]);

  const loginUser = () => {
    setIsAuthenticating(true);

    api.post('/auth/login', { username, password })
      .then((result) => afterAuth(result.user))
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsAuthenticating(false);
      });
  };

  const registerUser = () => {
    setIsRegistering(true);

    api.post('/auth/register', { username, password })
      .then((result) => afterAuth(result.user))
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsRegistering(false);
      });
  };

  const afterAuth = (user) => {
    authStore.setUser(user);
    navigation.navigate('profile');
  };

  return (
    <View style={ styles.container }>
      <TextInput
        value={ username }
        label="username"
        autoComplete="username"
        style={ styles.element }
        error={ isError }
        disabled={ isFormDisabled }
        autoFocus
        onChangeText={ setUsername }
      />
      <TextInput
        value={ password }
        label="password"
        autoComplete="password"
        style={ styles.element }
        error={ isError }
        disabled={ isFormDisabled }
        secureTextEntry
        onChangeText={ setPassword }
      />

      <View style={ { flexDirection: 'row', justifyContent: 'center' } }>
        <Button
          style={ styles.element }
          loading={ isRegistering }
          disabled={ isButtonsDisabled }
          onPress={ registerUser }
        >
          Register
        </Button>

        <Button
          style={ styles.element }
          loading={ isAuthenticating }
          disabled={ isButtonsDisabled }
          onPress={ loginUser }
        >
          Login
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex             : 1,
    justifyContent   : 'center',
    paddingHorizontal: 20,
  },
  element: {
    marginBottom: 20,
  },
});
