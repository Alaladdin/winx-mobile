import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import theme from '@/theme';
import { api } from '@/services/api';
import { useStores } from '@/models';
import { EmptyState } from '@/components/EmptyState';
import { LoaderScreen } from '@/components';

// todo
// refresh marks
// set user
// delete user
// fetch data

const loadBarsData = () => api
  .get('/bars/user')
  .then((data) => data.barsUser);

const loaderScreen = <LoaderScreen />;

export function BarsScreen() {
  const { authStore } = useStores();
  const { data, refetch, isLoading, isRefetching, isError, isRefetchError } = useQuery(['bars'], loadBarsData, { enabled: !!authStore.user.barsUser });

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const showLoader = useMemo(() => isLoading || isRefetching, [isLoading, isRefetching]);
  const showEmptyState = useMemo(() => !data || isError || isRefetchError, [data, isError, isRefetchError]);

  if (showLoader)
    return loaderScreen;

  if (showEmptyState)
    return <EmptyState buttonProps={ { onPress: refetch } } />;

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
