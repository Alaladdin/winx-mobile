import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useMemo, useState } from 'react';
import theme from '@/theme';
import { useStores } from '@/models';
import { useRequest } from '@/hooks/useRequest';
import { Icon } from '@/components';
import { IBarsUser } from '@/screens/BarsScreen/BarsScreen.interfaces';

interface IBarsLogin {
  onLoginSuccess?: (data: IBarsUser) => void
}

export function BarsLogin({ onLoginSuccess }: IBarsLogin) {
  const { authStore } = useStores();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const isFormDisabled = useMemo(() => !username || !password || isLoading, [username, password, isLoading]);

  const setBarsUser = useRequest({
    url   : '/bars/user',
    method: 'post',
    data  : { username, password },
  });

  const loginBarsUser = () => {
    setIsLoading(true);
    setIsError(false);

    setBarsUser()
      .then((data) => {
        authStore.setUser({ barsUser: data.barsUser._id });
        onLoginSuccess?.(data);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={ styles.container }>
      <Text variant="headlineSmall" style={ styles.pageTitle }>
        MPEI user
      </Text>

      <View style={ styles.banner }>
        <Icon icon="info-circle" style={ { marginRight: theme.spacing.extraSmall } } />
        <Text>Your data will be encrypted</Text>
      </View>

      <TextInput
        style={ styles.spacing }
        label="Login"
        value={ username }
        autoComplete="username"
        error={ isError }
        disabled={ isLoading }
        onChangeText={ setUsername }
      />

      <TextInput
        style={ styles.spacing }
        label="Password"
        value={ password }
        autoComplete="password"
        error={ isError }
        disabled={ isLoading }
        secureTextEntry
        onChangeText={ setPassword }
      />

      <Button
        mode="elevated"
        loading={ isLoading }
        disabled={ isFormDisabled }
        onPress={ loginBarsUser }
      >
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding       : theme.spacing.large,
    width         : '100%',
    minHeight     : '100%',
  },
  pageTitle: {
    marginBottom: theme.spacing.medium,
    textAlign   : 'center',
  },
  banner: {
    flexDirection  : 'row',
    alignItems     : 'center',
    borderRadius   : 4,
    marginBottom   : theme.spacing.medium,
    padding        : theme.spacing.medium,
    backgroundColor: theme.colors.elevation.level2,

  },
  spacing: {
    marginBottom: theme.spacing.medium,
  },
});
