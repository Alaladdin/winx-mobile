import { ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, List, Text } from 'react-native-paper';
import { useMemo, useState } from 'react';
import { map } from 'lodash';
import moment from 'moment';
import { useStores } from '@/models';
import config from '@/config';
import theme from '@/theme';
import { Button, ConfirmActionDialog } from '@/components';

export function ProfileScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { authStore } = useStores();
  const { avatar, username, displayName, lastOnline, lastLoggedAt, createdAt, scope } = authStore.user;
  const avatarSourceOptions = { uri: `${config.imageBaseUrl}${avatar}`, width: 128, height: 128 };
  const currentDisplayName = displayName || username;
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [showConfirmRemoveAccountModal, setShowConfirmRemoveAccountModal] = useState<boolean>(false);

  const accountAge = useMemo(() => `${moment().diff(createdAt, 'days')} days`, [createdAt]);
  const lastLoggedDate = useMemo(() => moment(lastLoggedAt).fromNow(), [lastLoggedAt]);
  const lastOnlineDate = useMemo(() => moment(lastOnline).fromNow(), [lastOnline]);

  const userOptions = useMemo(() => ([
    { title: 'Username', value: username },
    { title: 'Display name', value: displayName || '/empty/' },
    { title: 'Account age', value: accountAge },
    { title: 'Last logged at', value: lastLoggedDate },
    { title: 'Last online', value: lastOnlineDate },
    { title: 'Access level', value: scope.join(', ') },
  ]), [username, displayName, accountAge, lastLoggedDate, lastOnlineDate, scope]);

  const loadUser = () => {
    setIsLoading(true);

    authStore.loadUser()
      .finally(() => {
        setIsLoading(false);
      });
  };

  const removeUser = () => {
    setIsRemoving(true);

    authStore.removeUser()
      .finally(() => {
        setIsRemoving(false);
      });
  };

  const logoutUser = () => {
    authStore.setUser(null);
    navigation.navigate('main');
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={ styles.container }
        refreshControl={ <RefreshControl refreshing={ isLoading } onRefresh={ loadUser } /> }
      >
        <ImageBackground
          style={ styles.imageBackground }
          source={ { uri: `${config.imageBaseUrl}/cover/default` } }
          borderRadius={ 4 }
          progressiveRenderingEnabled
        >
          <View style={ { paddingTop: 200 + 50, zIndex: 1 } }>
            <Avatar.Image
              size={ 128 }
              source={ avatarSourceOptions }
            />

            <View style={ styles.displayNameContainer }>
              <Text>
                { currentDisplayName }
              </Text>
            </View>
          </View>
          <View style={ styles.imageBackgroundOverlay } />
        </ImageBackground>

        { map(userOptions, (option, index) => (
          <List.Item
            key={ index }
            title={ option.title }
            style={ styles.fullWidth }
            right={ () => (
              <Text style={ styles.listValue }>
                { option.value }
              </Text>
            ) }
          />
        ))}

        <View style={ { marginTop: 20, width: '100%' } }>
          <Button
            text="Remove account"
            variant="danger"
            loading={ isRemoving }
            disabled={ isRemoving }
            uppercase
            onPress={ () => setShowConfirmRemoveAccountModal(true) }
          />

          <Button
            text="Log out"
            style={ { marginTop: 10 } }
            uppercase
            disabled={ isRemoving }
            onPress={ logoutUser }
          />
        </View>
      </ScrollView>

      <ConfirmActionDialog
        visible={ showConfirmRemoveAccountModal }
        title="Warning"
        body="Are u sure want to delete your account?"
        onConfirm={ removeUser }
        onDismiss={ () => setShowConfirmRemoveAccountModal(false) }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems   : 'center',
    paddingBottom: 50,
    width        : '100%',
  },
  imageBackground: {
    justifyContent: 'center',
    alignItems    : 'center',
    marginBottom  : 150,
    width         : '100%',
    height        : 200,
  },
  imageBackgroundOverlay: {
    position       : 'absolute',
    width          : '100%',
    height         : '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
