import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import React from 'react';
import theme from '@/theme';
import { Icon } from '@/components';

export function BarsCredentialsError({ onDeleteUser }) {
  return (
    <View style={ styles.errorContainer }>
      <View style={ styles.headerContainer }>
        <Icon icon="triangle-exclamation" color={ theme.colors.rose[400] } ripperStyle={ styles.icon } />
        <Text variant="titleLarge" style={ { color: theme.colors.rose[400] } }>
          Credentials error
        </Text>
      </View>
      <Button mode="contained-tonal" onPress={ onDeleteUser }>
        Delete mpei user
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    alignItems    : 'center',
    justifyContent: 'center',
    height        : '90%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems   : 'center',
    marginBottom : theme.spacing.large,
  },
  icon: {
    marginRight: theme.spacing.small,
  },
});
