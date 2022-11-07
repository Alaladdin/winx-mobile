import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { map, reject } from 'lodash/collection';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { Header, Icon } from '@/components';
import { routesList } from './routes';
import { useStores } from '@/models';
import { AuthScreen } from '@/screens/AuthScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const renderIcon = (params: { route, color: string, focused: boolean }) => {
  const { route, color } = params;

  return (
    <View style={ styles.iconContainer }>
      <Icon
        icon={ route.icon }
        color={ color }
        size={ 16 }
      />
    </View>
  );
};

export const MainScreen = observer(() => {
  const { settingsStore } = useStores();
  const { authStore } = useStores();
  const userScope = authStore.user.scope;
  const currentRoutes = useMemo(
    () => reject(routesList, ({ scope }) => scope && !userScope.includes(scope)),
    [userScope]
  );

  return (
    <Tab.Navigator
      backBehavior="history"
      initialRouteName={ settingsStore.initialRoute }
    >
      {
            map(currentRoutes, (route) => (
              <Tab.Screen
                name={ route.title }
                key={ route.name }
                getComponent={ () => route.component }
                options={ {
                  tabBarIcon: (params) => renderIcon({ ...params, route }),
                } }
              />
            ))
        }
    </Tab.Navigator>
  );
});

export const MainNavigator = observer(() => {
  const { authStore } = useStores();
  const { avatar, isLoggedIn } = authStore.user;

  return (
    <Stack.Navigator
      screenOptions={ {
        animation: 'fade_from_bottom',
        header   : ({ navigation, route }) => {
          const showBackButton = route.name === 'profile';

          return (
            <Header
              avatar={ avatar }
              onBackPress={ showBackButton && navigation.navigate.bind(this, 'main') }
              onAvatarPress={ () => navigation.navigate(isLoggedIn ? 'profile' : 'auth') }
            />
          );
        },
      } }
    >
      <Stack.Screen name="main" component={ MainScreen } />
      {
        isLoggedIn
          ? (<Stack.Screen name="profile" component={ ProfileScreen } />)
          : (<Stack.Screen name="auth" component={ AuthScreen } />)
      }
    </Stack.Navigator>
  );
});

const styles = StyleSheet.create({
  iconContainer: {
    flex          : 1,
    justifyContent: 'center',
  },
});
