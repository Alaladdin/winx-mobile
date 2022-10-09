import React from 'react';
import { SafeAreaView } from 'react-native';
import { Header, HeaderProps } from './Header';

interface BaseScreenProps {
  children?: React.ReactNode
  headerProps: HeaderProps
}

export function Screen(props: BaseScreenProps) {
  const { headerProps, children } = props;
  const allHeaderProps = {
    leftIcon : 'bell',
    rightIcon: 'user-astronaut',
    ...headerProps,
  };

  return (
    <SafeAreaView>
      <Header { ...allHeaderProps } />
      { children }
    </SafeAreaView>
  );
}
