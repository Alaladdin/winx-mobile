import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text, FAB, Snackbar } from 'react-native-paper';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react';
import theme from '@/theme';
import { EmptyState } from '@/components/EmptyState';
import { Loader } from '@/components';
import { useRequest } from '@/hooks/useRequest';
import { IBarsUser } from '@/screens/BarsScreen/BarsScreen.interfaces';
import { BarsLogin } from './BarsLogin';
import { useStores } from '@/models';
import { BarsCredentialsError } from '@/screens/BarsScreen/BarsCredentialsError';
import { BarsMarksList } from '@/screens/BarsScreen/BarsMarksList';

const formatBarsUserData = (data): IBarsUser => {
  const { barsUser } = data;

  return {
    ...barsUser,
    updatedAt: moment(barsUser.updatedAt).format('HH:mm — DD.MM'),
  };
};

const loaderScreen = <Loader />;

export const BarsScreen = observer(() => {
  const { user, setUser } = useStores().authStore;
  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  const [isMenuOpened, setMenuOpened] = useState<boolean>(false);
  const refreshBarsUserData = useRequest({ method: 'post', url: '/bars/user/refreshMarks' });
  const removeBarsUser = useRequest({ method: 'delete', url: '/bars/user' });
  const loadBarsUserData = useRequest({ method: 'get', url: '/bars/user', afterResponse: formatBarsUserData });
  const { data, refetch, isLoading, isRefetching, isError } = useQuery(['/bars/user', user.barsUser], {
    enabled: !!user.barsUser,
    queryFn: loadBarsUserData,
  });

  const showEmptyState = useMemo(() => !data || isError, [data, isError]);
  const closeSnackBar = () => setSnackBarMessage('');

  const refreshBarsData = useCallback(() => {
    refreshBarsUserData()
      .then(() => {
        setTimeout(refetch, 7 * 1000);
      })
      .catch(setSnackBarMessage);
  }, [refetch, refreshBarsUserData]);

  const removeBarsUserData = useCallback(() => {
    removeBarsUser()
      .then(() => {
        setUser({ barsUser: null });
      })
      .catch(setSnackBarMessage);
  }, [setUser, removeBarsUser]);

  const menuOptions = useMemo(() => ([
    { label: 'Delete user', icon: 'trash-can-outline', onPress: removeBarsUserData },
    { label: 'Refresh marks', icon: 'refresh', onPress: refreshBarsData },
  ]), [removeBarsUserData, refreshBarsData]);

  if (!user.barsUser)
    return <BarsLogin />;

  if (isLoading)
    return loaderScreen;

  if (showEmptyState)
    return <EmptyState buttonProps={ { onPress: refetch } } />;

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={ styles.container }
        refreshControl={ <RefreshControl refreshing={ isRefetching } onRefresh={ refetch } /> }
      >
        <View style={ styles.header }>
          <Text variant="titleMedium">
            { data.username }
          </Text>
          <Text>
            { data.updatedAt }
          </Text>
        </View>

        {
          !!data.isCredentialsError && (
            <BarsCredentialsError onDeleteUser={ removeBarsUserData } />
          )
        }

        <BarsMarksList marks={ data.marks } />
      </ScrollView>

      <Snackbar
        visible={ !!snackBarMessage }
        duration={ 3000 }
        onDismiss={ closeSnackBar }
      >
        { snackBarMessage }
      </Snackbar>
      <FAB.Group
        open={ isMenuOpened }
        icon={ isMenuOpened ? 'dots-horizontal' : 'dots-vertical' }
        actions={ menuOptions }
        visible
        onStateChange={ (e) => setMenuOpened(e.open) }
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.massive,
    width        : '100%',
    minHeight    : '100%',
  },
  header: {
    flexDirection  : 'row',
    justifyContent : 'space-between',
    alignItems     : 'center',
    marginBottom   : theme.spacing.large,
    padding        : theme.spacing.medium,
    backgroundColor: theme.colors.elevation.level3,
  },
  input: {
    marginBottom: theme.spacing.medium,
  },
});
