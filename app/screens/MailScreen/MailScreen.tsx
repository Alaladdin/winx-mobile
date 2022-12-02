import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { filter, flatten, map, noop } from 'lodash';
import { Text, Searchbar, TouchableRipple, ProgressBar, List, Avatar } from 'react-native-paper';
import { observer } from 'mobx-react';
import theme from '@/theme';
import { Button, Loader, EmptyState, Icon, ConfirmActionDialog } from '@/components';
import { useStores } from '@/models';
import { IMail } from '@/screens/MailScreen/MailScreen.types';

const loaderScreen = <Loader />;

export const MailScreen = observer(({ navigation }) => {
  const { user } = useStores().authStore;
  const { loadMail, toggleRead, clearMailCache } = useStores().mailStore;
  const { removeUser } = useStores().barsStore;
  const { setSnackBarOptions } = useStores().mainStore;
  const query = useInfiniteQuery({
    queryKey        : ['mail', user.barsUser],
    queryFn         : ({ pageParam }) => loadMail(pageParam),
    getNextPageParam: (_, pages) => ({ offset: pages.length * 10 ?? 0 }),
    enabled         : !!user.barsUser,
  });
  const [search, setSearch] = useState<string>('');
  const [currentData, setCurrentData] = useState<IMail[]>(null);
  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showConfirmRemoveAccountModal, setShowConfirmRemoveAccountModal] = useState<boolean>(false);
  const canUpdate = useMemo(() => !isUpdating && !isMoreLoading, [isUpdating, isMoreLoading]);
  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={ canUpdate && query.isRefetching && !query.isFetchingNextPage }
      enabled={ canUpdate }
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
  const flatRawData = useMemo(() => flatten(query.data?.pages), [query.data]);
  const onRequestError = useCallback((message) => setSnackBarOptions(message, 'error'), [setSnackBarOptions]);
  const removeBarsUser = useCallback(() => removeUser().catch(onRequestError), [removeUser, onRequestError]);

  useEffect(() => {
    if (!query.isLoading && !query.isError) {
      const searchVal = search.toLowerCase();
      let newData = flatRawData;

      if (search) {
        newData = filter(newData, (item) => {
          const title = item.title.toLowerCase();
          const body = item.body?.toLowerCase();
          const from = item.from.toLowerCase();

          return title.includes(searchVal) || body?.includes(searchVal) || from.includes(searchVal);
        });
      }

      setCurrentData(newData);
    }
  }, [search, query.data, query.isLoading, query.isError]);

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

    if (!mail.isRead)
      toggleRead(mail).catch(noop);
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
        map(currentData, (item) => (
          <TouchableRipple
            key={ item._id }
            style={ styles.item }
            borderless
            onPress={ () => openMail(item) }
          >
            <List.Item
              title={ item.title }
              description={ `${item.from}${item.body ? `\n${item.body}` : ''}` }
              left={ () => (
                <View style={ { marginTop: theme.spacing.extraSmall, marginRight: theme.spacing.tiny } }>
                  <Avatar.Text label={ item.from[0] } size={ 30 } />
                </View>
              ) }
              right={ () => (
                <View style={ {
                  flexDirection : 'row',
                  alignItems    : 'flex-start',
                  justifyContent: 'flex-end',
                  marginLeft    : theme.spacing.extraSmall,
                  marginTop     : theme.spacing.extraSmall,
                  width         : '20%',
                } }
                >
                  {
                    !!item.attachments?.length && (
                      <Icon style={ { flex: 0, marginRight: theme.spacing.large } } icon="file" />
                    )
                  }
                  <Text>{ item.receivedAt }</Text>
                </View>
              ) }
            />
          </TouchableRipple>
        ))
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
    backgroundColor: theme.colors.elevation.level3,
  },
  loadMore: {
    borderRadius   : 0,
    backgroundColor: theme.colors.elevation.level3,
  },
});
