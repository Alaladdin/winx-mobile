import { BottomNavigation, Text } from 'react-native-paper';
import { useState } from 'react';
import { ScheduleScreen } from '../screens';
import { translate } from '../i18n';
import { Icon } from '../components';

function AlbumsRoute() {
  return <Text>Albums</Text>;
}

function RecentsRoute() {
  return <Text>Recents</Text>;
}

function NotificationsRoute() {
  return <Text>Notifications</Text>;
}

export function MainNavigator() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'schedule', title: 'mainNavigator.scheduleTab', focusedIcon: 'calendar-days' },
    { key: 'actuality', title: 'mainNavigator.actualityTab', focusedIcon: 'newspaper' },
    { key: 'bars', title: 'mainNavigator.barsTab', focusedIcon: 'book' },
    { key: 'settings', title: 'mainNavigator.settingsTab', focusedIcon: 'bars' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    schedule : ScheduleScreen,
    actuality: AlbumsRoute,
    bars     : RecentsRoute,
    settings : NotificationsRoute,
  });

  return (
    <BottomNavigation
      navigationState={ { index, routes } }
      getLabelText={ ({ route }) => translate(route.title) }
      renderIcon={ ({ route, color, focused }) => {
        const { focusedIcon, unfocusedIcon } = route;
        const icon = (!focused && unfocusedIcon) ? unfocusedIcon : focusedIcon;

        return <Icon icon={ icon } color={ color } size={ 20 } />;
      } }
      onIndexChange={ setIndex }
      renderScene={ renderScene }
    />
  );
}
