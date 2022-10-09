import React from 'react';
import { Screen } from '../components';

export function ScheduleScreen() {
  return (
    <Screen
      preset="scroll"
      HeaderProps={ {
        title    : 'mainNavigator.scheduleTab',
        leftIcon : 'bell',
        rightIcon: 'user-astronaut',
      } }
    />
  );
}
