import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { map } from 'lodash';
import { Text, Searchbar, TouchableRipple, ProgressBar } from 'react-native-paper';
import { observer } from 'mobx-react';
import theme from '@/theme';
import { Button, Loader, EmptyState, Icon, ConfirmActionDialog } from '@/components';
import { useStores } from '@/models';

const loaderScreen = <Loader />;

export const MailScreen = observer(({ navigation }) => {
  const { user } = useStores().authStore;
  const { loadMail, clearMailCache } = useStores().mailStore;
  const { removeUser } = useStores().barsStore;
  const { setSnackBarOptions } = useStores().mainStore;
  const query = useInfiniteQuery({
    queryKey        : ['mail', user.barsUser],
    queryFn         : ({ pageParam }) => loadMail(pageParam),
    getNextPageParam: (_, pages) => ({ offset: pages.length * 10 ?? 0 }),
    enabled         : !!user.barsUser,
  });
  const [search, setSearch] = useState<string>('');
  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showConfirmRemoveAccountModal, setShowConfirmRemoveAccountModal] = useState<boolean>(false);
  const canUpdate = useMemo(() => !isUpdating && !isMoreLoading, [isUpdating, isMoreLoading]);
  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={ canUpdate && query.isRefetching && !query.isFetchingNextPage }
      enabled={ canUpdate }
      title="asdsad"
      onRefresh={ query.refetch }
    />
  ), [canUpdate, query]);
  const emptyStateProps = useMemo(() => ({
    bodyText   : !user.barsUser && 'Have no MPEI user found',
    buttonProps: {
      text   : !user.barsUser && 'Login',
      onPress: user.barsUser ? query.refetch : () => navigation.navigate('Bars'),
    },
  }), [query, user]);
  const onRequestError = useCallback((message) => setSnackBarOptions(message, 'error'), [setSnackBarOptions]);
  const removeBarsUser = useCallback(() => removeUser().catch(onRequestError), [removeUser, onRequestError]);

  const updateMailData = useCallback(() => {
    setIsUpdating(true);

    clearMailCache()
      .then(() => query.refetch())
      .finally(() => {
        setIsUpdating(false);
      });
  }, [query, clearMailCache]);

  const loadMore = useCallback(() => {
    setIsMoreLoading(true);

    query.fetchNextPage()
      .finally(() => {
        setIsMoreLoading(false);
      });
  }, [query]);

  if (query.isError || !user.barsUser)
    return <EmptyState { ...emptyStateProps } />;

  if (query.isLoading)
    return loaderScreen;

  const openMail = (mail) => {
    navigation.navigate('mail-item', { mail });
  };

  return (
    <View style={ styles.container }>
      <ProgressBar visible={ isUpdating } indeterminate />
      <View style={ styles.header }>
        <Button
          icon="rotate-right"
          disabled={ !canUpdate }
          onPress={ updateMailData }
        />
        <Searchbar
          style={ styles.searchBar }
          value={ search }
          placeholder="Search"
          onChangeText={ setSearch }
        />
        <Button
          icon="trash-can"
          onPress={ () => setShowConfirmRemoveAccountModal(true) }
        />
      </View>

      <ScrollView refreshControl={ refreshControl }>
        {
        map(query.data.pages, (page) => map(page, (item) => (
          <TouchableRipple key={ item._id } style={ styles.item } onPress={ () => openMail(item) }>
            <View style={ styles.itemContainer }>
              <View>
                <Text style={ styles.itemTitle }>
                  { item.title }
                </Text>
                <Text>{ item.from }</Text>
              </View>
              <View>
                <Text>{ item.receivedAt }</Text>
                {
                !!item.attachments?.length && (
                  <Icon style={ styles.itemFileIcon } icon="file" />
                )
              }
              </View>
            </View>
          </TouchableRipple>
        )))
      }
        <Button
          style={ styles.loadMore }
          text="load more"
          mode="contained-tonal"
          disabled={ isMoreLoading }
          loading={ isMoreLoading }
          onPress={ loadMore }
        />
      </ScrollView>

      <ConfirmActionDialog
        visible={ showConfirmRemoveAccountModal }
        title="Warning"
        body="Are you sure want to delete mpei account?"
        onConfirm={ removeBarsUser }
        onDismiss={ () => setShowConfirmRemoveAccountModal(false) }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width    : '100%',
    maxHeight: '100%',
    minHeight: '100%',
  },
  header: {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    paddingHorizontal: theme.spacing.extraSmall,
    paddingVertical  : theme.spacing.extraSmall,
    backgroundColor  : theme.colors.elevation.level3,
    zIndex           : 1,
  },
  headerButton: {
    fontSize: 18,
  },
  searchBar: {
    borderRadius: 100,
    width       : '65%',
    height      : '80%',
  },
  item: {
    padding        : theme.spacing.medium,
    backgroundColor: theme.colors.elevation.level3,
  },
  itemContainer: {
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems    : 'center',
    width         : '100%',
  },
  itemTitle: {
    marginBottom: theme.spacing.extraSmall,
    maxWidth    : '80%',
    fontSize    : theme.spacing.medium,
    fontWeight  : '600',
  },
  itemFileIcon: {
    marginLeft: 'auto',
  },
  loadMore: {
    borderRadius   : 0,
    backgroundColor: theme.colors.elevation.level3,
  },
});
