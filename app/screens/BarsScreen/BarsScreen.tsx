import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button, FAB, Snackbar } from 'react-native-paper';
import { map } from 'lodash/collection';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react';
import theme from '@/theme';
import { EmptyState } from '@/components/EmptyState';
import { Icon, Loader } from '@/components';
import { useRequest } from '@/hooks/useRequest';
import { IBarsUser, IBarsUserMark } from '@/screens/BarsScreen/BarsScreen.interfaces';
import { BarsLogin } from './BarsLogin';
import { useStores } from '@/models';

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
  const [isMenuOpened, setMenuOpened] = useState(false);
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
  }, [removeBarsUser]);

  const removeBarsUserData = useCallback(() => {
    removeBarsUser()
      .then(() => {
        setUser({ barsUser: null });
      })
      .catch(setSnackBarMessage);
  }, [removeBarsUser]);

  const errorContainer = useMemo(() => (
    <View style={ styles.errorContainer }>
      <View style={ { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.large } }>
        <Icon icon="triangle-exclamation" color={ theme.colors.rose[400] } ripperStyle={ { marginRight: theme.spacing.small } } />
        <Text variant="titleLarge" style={ { color: theme.colors.rose[400] } }>
          Credentials error
        </Text>
      </View>
      <Button onPress={ removeBarsUserData } mode="contained-tonal">
        Delete user
      </Button>
    </View>
  ), [removeBarsUserData]);

  if (!user.barsUser)
    return <BarsLogin />;

  if (isLoading)
    return loaderScreen;

  if (showEmptyState)
    return <EmptyState buttonProps={ { onPress: refetch } } />;

  return (
    <SafeAreaView>
      <ScrollView
        style={ styles.container }
        contentContainerStyle={ [styles.container, styles.containerContent] }
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

        { !!data.isCredentialsError && errorContainer }

        {
        map(data.marks, (mark: IBarsUserMark) => (
          <View style={ styles.list } key={ mark.discipline }>
            <Text style={ styles.listTitle } variant="titleMedium">
              { mark.discipline }
            </Text>
            <View style={ styles.listBody }>
              <View style={ { flexDirection: 'row' } }>
                {
                  map(mark.semester, (semesterMark, index) => (
                    <Text
                      key={ index }
                      style={ [
                        styles.listItem,
                        semesterMark !== '⋆' && styles.bgRed,
                        semesterMark > 3 && styles.bgYellow,
                        semesterMark > 4 && styles.bgGreen,
                      ] }
                    >
                      { semesterMark }
                    </Text>
                  ))
                }
              </View>

              <View style={ { flexDirection: 'row' } }>
                {
                  map(mark.final, (finalMark, index) => (
                    <Text
                      key={ index }
                      style={ [
                        styles.listItem,
                        finalMark !== '⋆' && styles.bgRed,
                        finalMark > 3 && styles.bgYellow,
                        finalMark > 4 && styles.bgGreen,
                      ] }
                    >
                      { finalMark }
                    </Text>
                  ))
                }
              </View>
            </View>
          </View>
        ))
      }
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
        actions={ [
          {
            label  : 'Delete user',
            icon   : 'trash-can-outline',
            onPress: removeBarsUserData,
          },
          {
            label  : 'Refresh marks',
            icon   : 'refresh',
            onPress: refreshBarsData,
          },
        ] }
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
  containerContent: {
    flexDirection: 'column',
  },
  header: {
    flexDirection  : 'row',
    justifyContent : 'space-between',
    alignItems     : 'center',
    marginBottom   : theme.spacing.large,
    padding        : theme.spacing.medium,
    backgroundColor: theme.colors.elevation.level3,
  },
  errorContainer: {
    alignItems    : 'center',
    justifyContent: 'center',
    height        : '90%',
  },
  list: {
    marginBottom: theme.spacing.large,
  },
  listTitle: {
    padding        : theme.spacing.medium,
    backgroundColor: theme.colors.elevation.level3,
  },
  listBody: {
    flexDirection  : 'row',
    justifyContent : 'space-between',
    padding        : theme.spacing.extraSmall,
    backgroundColor: theme.colors.elevation.level2,
  },
  listItem: {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    marginRight      : theme.spacing.tiny,
    paddingHorizontal: theme.spacing.extraSmall,
    paddingVertical  : theme.spacing.tiny,
    borderRadius     : theme.roundness,
    backgroundColor  : theme.colors.elevation.level4,
  },
  input: {
    marginBottom: theme.spacing.medium,
  },
  bgRed: {
    backgroundColor: theme.colors.rose[500],
  },
  bgGreen: {
    backgroundColor: theme.colors.green[500],
  },
  bgYellow: {
    backgroundColor: theme.colors.orange[400],
  },
});
