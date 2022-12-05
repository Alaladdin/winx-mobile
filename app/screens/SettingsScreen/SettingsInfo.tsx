import React, { useMemo } from 'react';
import { List, Text } from 'react-native-paper';
import { View } from 'react-native';
import { ISettingSection } from './ISettingSection';
import { Button } from '@/components';
import { openLinkInBrowser } from '@/utils/open-link-in-browser';

export function SettingsInfo({ headingStyle }: ISettingSection) {
  const goToChannelButton = useMemo(() => (
    <Button
      text="winx_mobile"
      icon={ ['fab', 'telegram'] }
      onPress={ () => openLinkInBrowser('https://t.me/winx_mobile') }
    />
  ), []);

  const goToGithubButton = useMemo(() => (
    <Button
      text="winx-mobile"
      icon={ ['fab', 'github'] }
      onPress={ () => openLinkInBrowser('https://github.com/Alaladdin/winx-mobile') }
    />
  ), []);

  const goToAuthorProfileButton = useMemo(() => (
    <Button
      text="tecna fairy"
      icon={ ['fab', 'telegram'] }
      onPress={ () => openLinkInBrowser('https://t.me/Cooala') }
    />
  ), []);

  return (
    <View>
      <Text variant="headlineSmall" style={ headingStyle }>Info</Text>

      <List.Item
        title="News channel"
        right={ () => goToChannelButton }
      />

      <List.Item
        title="Source code"
        right={ () => goToGithubButton }
      />

      <List.Item
        title="Contact me"
        right={ () => goToAuthorProfileButton }
      />
    </View>
  );
}
