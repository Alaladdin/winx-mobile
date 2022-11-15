import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, List, Text, TouchableRipple, Button } from 'react-native-paper';
import { useMemo, useState } from 'react';
import { map } from 'lodash';
import moment from 'moment';
import { useStores } from '@/models';
import config from '@/config';
import theme from '@/theme';
import { api } from '@/services/api';

export function ProfileScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { authStore } = useStores();
  const { avatar, username, displayName, lastOnline, lastLoggedAt, createdAt, scope, token } = authStore.user;
  const avatarSourceOptions = { uri: `${config.avatarBaseUrl}${avatar}`, width: 128, height: 128 };
  const currentDisplayName = displayName || username;

  const accountAge = useMemo(() => `${moment().diff(createdAt, 'days')} days`, [createdAt]);
  const lastLoggedDate = useMemo(() => moment(lastLoggedAt).fromNow(), [lastLoggedAt]);
  const lastOnlineDate = useMemo(() => moment(lastOnline).fromNow(), [lastOnline]);

  const userOptions = useMemo(() => ([
    { title: 'Account age', value: accountAge },
    { title: 'Last logged at', value: lastLoggedDate },
    { title: 'Last online', value: lastOnlineDate },
    { title: 'Access level', value: scope.join(', ') },
  ]), [accountAge, lastLoggedDate, lastOnlineDate, scope]);

  const logout = () => {
    authStore.setUser(null);
    navigation.navigate('main');
  };

  const reFetchUser = () => {
    setIsLoading(true);

    // todo remove manual tokn pass
    api.get('/auth/user', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        authStore.setUser(data.user);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.kind === 'unauthorized')
          logout();
      });
  };

  return (
    <ScrollView
      contentContainerStyle={ styles.container }
      refreshControl={ <RefreshControl refreshing={ isLoading } onRefresh={ reFetchUser } /> }
    >
      <Avatar.Image
        size={ 128 }
        source={ avatarSourceOptions }
      />

      <View style={ styles.displayNameContainer }>
        <Text>
          { currentDisplayName }
        </Text>
      </View>

      { map(userOptions, (option, index) => (
        <TouchableRipple
          key={ index }
          style={ styles.fullWidth }
        >
          <List.Item
            title={ option.title }
            style={ styles.fullWidth }
            right={ () => (
              <Text style={ styles.listValue }>
                { option.value }
              </Text>
            ) }
          />
        </TouchableRipple>
      ))}

      <Button onPress={ logout }>Log out</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems     : 'center',
    paddingVertical: 20,
    width          : '100%',
  },
  displayNameContainer: {
    alignItems       : 'center',
    marginVertical   : 20,
    paddingVertical  : 5,
    paddingHorizontal: 25,
    borderRadius     : 20,
    backgroundColor  : theme.colors.elevation.level5,
  },
  displayName: {
    textAlign: 'center',
    color    : theme.colors.neutral80,
  },
  listValue: {
    textAlignVertical: 'center',
    height           : '100%',
  },
  fullWidth: {
    width: '100%',
  },
});
