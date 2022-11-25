import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react';
import theme from '@/theme';
import { Button, ConfirmActionDialog, EmptyState, Loader } from '@/components';
import { useRequest } from '@/hooks/useRequest';
import { IBarsUser } from '@/screens/BarsScreen/BarsScreen.interfaces';
import { BarsLogin } from './BarsLogin';
import { useStores } from '@/models';
import { BarsCredentialsError } from '@/screens/BarsScreen/BarsCredentialsError';
import { BarsMarksList } from '@/screens/BarsScreen/BarsMarksList';

const loaderScreen = <Loader />;
const formatBarsUserData = (data): IBarsUser => {
  const { barsUser } = data;

  return {
    ...barsUser,
    updatedAt: moment(barsUser.updatedAt).format('HH:mm — DD.MM'),
  };
};

export const BarsScreen = observer(() => {
  const { user, setUser } = useStores().authStore;
  const { setSnackBarOptions } = useStores().mainStore;
  const refreshBarsUserData = useRequest({ method: 'post', url: '/bars/user/refreshMarks' });
  const removeBarsUser = useRequest({ method: 'delete', url: '/bars/user' });
  const onRequestError = ({ message }) => setSnackBarOptions(message, 'error');
  const loadBarsUserData = useRequest({ method: 'get', url: '/bars/user', onResponse: formatBarsUserData, onError: onRequestError });
  const { data, refetch, isLoading, isRefetching, isError } = useQuery(['/bars/user', user.barsUser], {
    enabled: !!user.barsUser,
    queryFn: loadBarsUserData,
  });
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showConfirmRemoveAccountModal, setShowConfirmRemoveAccountModal] = useState<boolean>(false);
  const showEmptyState = useMemo(() => !data || isError, [data, isError]);

  const checkForNewData = useCallback((tiresCount = 0) => {
    setTimeout(() => {
      refetch()
        .then((res) => {
          if (res.data.updatedAt === lastUpdatedAt) {
            if (tiresCount > 3)
              setIsUpdating(false);
            else
              checkForNewData(tiresCount + 1);
          } else {
            setLastUpdatedAt(res.data.updatedAt);
            setIsUpdating(false);
          }
        })
        .catch(() => {
          setIsUpdating(false);
        });
    }, 5 * 1000);
  }, [refetch]);

  useEffect(() => {
    if (isUpdating) checkForNewData();
  }, [checkForNewData, isUpdating]);

  const updateBarsData = useCallback(() => {
    setLastUpdatedAt(data.updatedAt);
    setIsUpdating(true);

    refreshBarsUserData()
      .catch(onRequestError);
  }, [data, refreshBarsUserData]);

  const removeBarsUserData = useCallback(() => {
    removeBarsUser()
      .then(() => setUser({ barsUser: null }))
      .catch(onRequestError);
  }, [setUser, removeBarsUser]);

  if (!user.barsUser)
    return <BarsLogin onLoginSuccess={ () => setIsUpdating(true) } />;

  if (isLoading)
    return loaderScreen;

  if (showEmptyState)
    return <EmptyState buttonProps={ { onPress: refetch } } />;

  return (
    <SafeAreaView style={ { flex: 1 } }>
      <ProgressBar visible={ isUpdating } indeterminate />
      <ScrollView
        contentContainerStyle={ styles.container }
        refreshControl={ <RefreshControl refreshing={ !isUpdating && isRefetching } onRefresh={ refetch } /> }
      >
        <View style={ styles.header }>
          <View>
            <Text variant="titleMedium">
              { data.username }
            </Text>
            <Text>
              { data.updatedAt }
            </Text>
          </View>
          <View style={ { flexDirection: 'row' } }>
            <Button icon="rotate-right" disabled={ data.isCredentialsError || isUpdating } onPress={ updateBarsData } />
            <Button icon="trash-can" disabled={ isUpdating } onPress={ () => setShowConfirmRemoveAccountModal(true) } />
          </View>
        </View>

        { !!data.isCredentialsError && <BarsCredentialsError /> }

        <BarsMarksList marks={ data.marks } />
      </ScrollView>

      <ConfirmActionDialog
        visible={ showConfirmRemoveAccountModal }
        title="Warning"
        body="Are you sure want to delete bars account?"
        onConfirm={ removeBarsUserData }
        onDismiss={ () => setShowConfirmRemoveAccountModal(false) }
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
