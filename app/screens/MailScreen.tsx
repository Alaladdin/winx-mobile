import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import theme from '@/theme';
import { EmptyState } from '@/components/EmptyState';

export function MailScreen() {
  return (
    <ScrollView style={ styles.container } contentContainerStyle={ [styles.container, styles.containerContent] }>
      <EmptyState />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width    : '100%',
    minHeight: '100%',
  },
  containerContent: {
    flexDirection : 'column',
    justifyContent: 'center',
    padding       : theme.spacing.large,
  },
  input: {
    marginBottom: theme.spacing.medium,
  },
});
