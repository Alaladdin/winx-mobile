import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react';
import theme from '@/theme';
import { Button, ConfirmActionDialog, EmptyState, Loader } from '@/components';
import { BarsLogin } from './BarsLogin';
import { useStores } from '@/models';
import { BarsCredentialsError } from '@/screens/BarsScreen/BarsCredentialsError';
import { BarsMarksList } from '@/screens/BarsScreen/BarsMarksList';

const loaderScreen = <Loader />;

export const BarsScreen = observer(() => {
  const { setSnackBarOptions } = useStores().mainStore;
  const { user } = useStores().authStore;
  const { loadUser, refreshMarks, removeUser } = useStores().barsStore;
  const onRequestError = useCallback(({ message }) => setSnackBarOptions(message, 'error'), [setSnackBarOptions]);
  const query = useQuery({
    queryKey: ['/bars/user', user.barsUser],
    queryFn : loadUser,
    onError : onRequestError,
    enabled : !!user.barsUser,
  });
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>(null);
  const [updateTimer, setUpdateTimer] = useState<number>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showConfirmRemoveAccountModal, setShowConfirmRemoveAccountModal] = useState<boolean>(false);

  const RefreshControlTag = useMemo(() => (
    <RefreshControl
      refreshing={ !isUpdating && query.isRefetching }
      enabled={ !isUpdating }
      onRefresh={ query.refetch }
    />
  ), [isUpdating, query.isRefetching]);

  const checkForNewData = useCallback((tiresCount = 0) => {
    const timer = setTimeout(() => {
      query.refetch()
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

    setUpdateTimer(timer);
  }, []);

  useEffect(() => {
    if (isUpdating) checkForNewData();
    else clearTimeout(updateTimer);
  }, [isUpdating]);

  const updateBarsData = useCallback(() => {
    setLastUpdatedAt(query.data.updatedAt);
    setIsUpdating(true);

    refreshMarks()
      .catch((err) => {
        onRequestError(err);
        setIsUpdating(false);
      });
  }, [query.data, refreshMarks, onRequestError]);

  const removeBarsUser = useCallback(() => removeUser().catch(onRequestError), [removeUser, onRequestError]);

  if (!user.barsUser)
    return <BarsLogin onLoginSuccess={ () => setIsUpdating(true) } />;

  if (query.isLoading)
    return loaderScreen;

  if (query.isError)
    return <EmptyState buttonProps={ { onPress: query.refetch } } />;

  return (
    <SafeAreaView style={ { flex: 1 } }>
      <ProgressBar visible={ isUpdating } indeterminate />
      <ScrollView
        contentContainerStyle={ styles.container }
        refreshControl={ RefreshControlTag }
      >
        <View style={ styles.header }>
          <View>
            <Text variant="titleMedium">
              { query.data.username }
            </Text>
            <Text>
              { query.data.updatedAt }
            </Text>
          </View>
          <View style={ { flexDirection: 'row' } }>
            <Button icon="rotate-right" disabled={ query.data.isCredentialsError || isUpdating } onPress={ updateBarsData } />
            <Button icon="trash-can" disabled={ isUpdating } onPress={ () => setShowConfirmRemoveAccountModal(true) } />
          </View>
        </View>

        { !!query.data.isCredentialsError && <BarsCredentialsError /> }

        <BarsMarksList marks={ query.data.marks } />
      </ScrollView>

      <ConfirmActionDialog
        visible={ showConfirmRemoveAccountModal }
        title="Warning"
        body="Are you sure want to delete mpei account?"
        onConfirm={ removeBarsUser }
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
