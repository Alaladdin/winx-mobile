import React, { ErrorInfo } from 'react';
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Icon } from '../../components';
import theme from '../../theme';
import { translate } from '../../i18n';

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

export function ErrorDetails({ error, errorInfo: { componentStack }, onReset }: ErrorDetailsProps) {
  return (
    <View
      preset="fixed"
      safeAreaEdges={ ['top', 'bottom'] }
      contentContainerStyle={ $contentContainer }
    >
      <View style={ $topSection }>
        <Icon icon="bug" size={ 64 } />
        <Text style={ $heading }>
          { translate('errorScreen.title') }
        </Text>
        <Text>{ translate('errorScreen.friendlySubtitle') }</Text>
      </View>

      <ScrollView style={ $errorSection } contentContainerStyle={ $errorSectionContentContainer }>
        <Text style={ $errorContent }>
          { error?.toString()?.trim() }
        </Text>
        <Text selectable style={ $errorBacktrace }>
          { componentStack.trim() }
        </Text>
      </ScrollView>

      <Button style={ $resetButton } onPress={ onReset }>
        { translate('errorScreen.reset') }
      </Button>
    </View>
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
  color     : theme.colors.error,
  fontWeight: 'bold',
};

const $errorBacktrace: TextStyle = {
  marginTop: theme.spacing.medium,
  color    : theme.colors.error,
};

const $resetButton: ViewStyle = {
  backgroundColor  : theme.colors.error,
  paddingHorizontal: theme.spacing.huge,
};
