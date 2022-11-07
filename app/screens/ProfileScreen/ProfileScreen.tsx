import { StyleSheet, View } from 'react-native';
import { Avatar, List, Text, TouchableRipple, Button } from 'react-native-paper';
import { useMemo } from 'react';
import { map, noop } from 'lodash';
import moment from 'moment';
import { useStores } from '@/models';
import config from '@/config';
import theme from '@/theme';

export function ProfileScreen({ navigation }) {
  const { authStore } = useStores();
  const { avatar, username, displayName, lastOnline, lastLoggedAt, createdAt, scope } = authStore.user;
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
  ]), []);

  const logout = () => {
    authStore.setUser(null);
    navigation.navigate('main');
  };

  return (
    <View style={ styles.container }>
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
          onPress={ noop }
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
    </View>
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
