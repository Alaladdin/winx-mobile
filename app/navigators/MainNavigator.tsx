import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { map } from 'lodash';
import { Icon } from '@/components';
import { routesList } from './routes';

interface IMainNavProps {
  badges?: {
    [key: string]: number | null
  }
}

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

const Tab = createMaterialBottomTabNavigator();
export const MainNavigator = observer(({ badges = {} }: IMainNavProps) => (
  <Tab.Navigator backBehavior="history">
    {
        map(routesList, (route) => (
          <Tab.Screen
            name={ route.title }
            key={ route.name }
            component={ route.component }
            options={ {
              tabBarBadge: badges[route.name],
              tabBarIcon : (params) => renderIcon({ ...params, route }),
            } }
          />
        ))
      }
  </Tab.Navigator>
));

const styles = StyleSheet.create({
  iconContainer: {
    flex          : 1,
    justifyContent: 'center',
  },
});
