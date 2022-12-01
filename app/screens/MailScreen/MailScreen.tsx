import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { map } from 'lodash';
import { Text, Searchbar, TouchableRipple } from 'react-native-paper';
import theme from '@/theme';
import { Button, Loader, EmptyState, Icon } from '@/components';
import { useStores } from '@/models';

const loaderScreen = <Loader />;

export function MailScreen({ navigation }) {
  const { user } = useStores().authStore;
  const { loadMail } = useStores().mailStore;
  const { data, refetch, isLoading, isRefetching, isError } = useQuery(['mail'], loadMail);
  const [search, setSearch] = useState<string>('');
  const showEmptyState = useMemo(() => !data || isError, [data, isError]);
  const refreshControl = useMemo(() => (<RefreshControl refreshing={ isRefetching } onRefresh={ refetch } />), [isRefetching, refetch]);

  if (isLoading)
    return loaderScreen;

  if (showEmptyState || !user.barsUser)
    return <EmptyState buttonProps={ { onPress: refetch } } />;

  const openMail = (mail) => {
    navigation.navigate('mail-item', { mail });
  };

  const loadMore = () => {

  };

  return (
    <View style={ styles.container }>
      <View style={ styles.header }>
        <Button
          icon="rotate-right"
          onPress={ refetch }
          disabled
        />
        <Searchbar
          style={ styles.searchBar }
          value={ search }
          placeholder="Search"
          onChangeText={ setSearch }
        />
        <Button
          icon="trash-can"
          disabled
        />
      </View>

      <ScrollView refreshControl={ refreshControl }>
        {
        map(data, (item) => (
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
                !!item.attachments.length && (
                  <Icon style={ styles.itemFileIcon } icon="file" />
                )
              }
              </View>
            </View>
          </TouchableRipple>
        ))
      }
        <Button
          style={ styles.loadMore }
          text="load more"
          mode="contained-tonal"
          disabled
          onPress={ loadMore }
        />
      </ScrollView>
    </View>
  );
}

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
