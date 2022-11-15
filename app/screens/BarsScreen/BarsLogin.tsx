import { StyleSheet, View } from 'react-native';
import { Banner, Button, Text, TextInput } from 'react-native-paper';
import { useMemo, useState } from 'react';
import theme from '@/theme';
import { useStores } from '@/models';
import { useRequest } from '@/hooks/useRequest';
import { Icon } from '@/components';

const InfoCircleIcon = <Icon icon="info-circle" />;

export function BarsLogin() {
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

      <Banner
        actions={ [] }
        style={ styles.bannerContainer }
        icon={ () => InfoCircleIcon }
        visible
      >
        Fill mpei credentials
      </Banner>

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
  bannerContainer: {
    borderRadius: 4,
    marginBottom: theme.spacing.medium,
  },
  spacing: {
    marginBottom: theme.spacing.medium,
  },
});
