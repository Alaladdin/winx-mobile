import React, { ErrorInfo } from 'react';
import { ScrollView, TextStyle, View, ViewStyle } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Icon } from '@/components';
import theme from '@/theme';
import { translate } from '@/i18n';

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

export function ErrorDetails({ error, errorInfo: { componentStack }, onReset }: ErrorDetailsProps) {
  return (
    <View style={ $contentContainer }>
      <View style={ $topSection }>
        <Icon style={ $icon } icon="bug" size={ 64 } />
        <Text style={ $heading }>
          { translate('errorScreen.title') }
        </Text>
        <Text>{ translate('errorScreen.friendlySubtitle') }</Text>
      </View>

      <ScrollView style={ $errorSection } contentContainerStyle={ $errorSectionContentContainer }>
        <Text style={ $errorContent }>
          { `${error}`?.trim() }
        </Text>
        <Text style={ $errorBacktrace } selectable>
          { componentStack.trim() }
        </Text>
      </ScrollView>

      <Button mode="elevated" onPress={ onReset }>
        { translate('errorScreen.reset') }
      </Button>
    </View>
  );
}

const $contentContainer: ViewStyle = {
  flex             : 1,
  alignItems       : 'center',
  paddingHorizontal: theme.spacing.large,
  paddingTop       : theme.spacing.extraLarge,
};

const $topSection: ViewStyle = {
  alignItems  : 'center',
  marginBottom: theme.spacing.large,
};

const $icon: ViewStyle = {
  marginBottom: 20,
};

const $heading: TextStyle = {
  color       : theme.colors.error,
  marginBottom: theme.spacing.medium,
};

const $errorSection: ViewStyle = {
  maxHeight      : '65%',
  marginBottom   : theme.spacing.medium,
  borderRadius   : 6,
  backgroundColor: theme.colors.background,
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
