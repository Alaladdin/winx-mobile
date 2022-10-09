import React, { ErrorInfo } from 'react';
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Icon, Screen } from '../../components';
import theme from '../../theme';

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={ ['top', 'bottom'] }
      contentContainerStyle={ $contentContainer }
    >
      <View style={ $topSection }>
        <Icon icon="bug" size={ 64 } />
        <Text style={ $heading } preset="subheading" tx="errorScreen.title" />
        <Text tx="errorScreen.friendlySubtitle" />
      </View>

      <ScrollView style={ $errorSection } contentContainerStyle={ $errorSectionContentContainer }>
        <Text style={ $errorContent } weight="bold" text={ `${props.error}`.trim() } />
        <Text
          selectable
          style={ $errorBacktrace }
          text={ `${props.errorInfo.componentStack}`.trim() }
        />
      </ScrollView>

      <Button
        preset="reversed"
        style={ $resetButton }
        onPress={ props.onReset }
        tx="errorScreen.reset"
      />
    </Screen>
  );
}

const $contentContainer: ViewStyle = {
  alignItems       : 'center',
  paddingHorizontal: theme.spacing.large,
  paddingTop       : theme.spacing.extraLarge,
  flex             : 1,
};

const $topSection: ViewStyle = {
  flex      : 1,
  alignItems: 'center',
};

const $heading: TextStyle = {
  color       : theme.colors.error,
  marginBottom: theme.spacing.medium,
};

const $errorSection: ViewStyle = {
  flex           : 2,
  backgroundColor: theme.colors.background,
  marginVertical : theme.spacing.medium,
  borderRadius   : 6,
};

const $errorSectionContentContainer: ViewStyle = {
  padding: theme.spacing.medium,
};

const $errorContent: TextStyle = {
  color: theme.colors.error,
};

const $errorBacktrace: TextStyle = {
  marginTop: theme.spacing.medium,
  color    : theme.colors.error,
};

const $resetButton: ViewStyle = {
  backgroundColor  : theme.colors.error,
  paddingHorizontal: theme.spacing.huge,
};
