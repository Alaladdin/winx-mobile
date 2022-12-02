import { map } from 'lodash/collection';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import React from 'react';
import { BarsMark } from '@/screens/BarsScreen/BarsMark';
import { IBarsMark } from '@/screens/BarsScreen/BarsScreen.types';
import theme from '@/theme';

interface IBarsMarksList {
    marks: IBarsMark[]
}

const renderMarks = (marksList) => (
  <View style={ styles.flexRow }>
    {
        map(marksList, (mark, index) => (
          <BarsMark key={ index } mark={ mark } />
        ))
    }
  </View>
);

export function BarsMarksList({ marks }: IBarsMarksList) {
  return (
    map(marks, (mark: IBarsMark) => (
      <View style={ styles.list } key={ mark.discipline }>
        <Text style={ styles.listTitle } variant="titleMedium">
          { mark.discipline }
        </Text>

        <View style={ styles.listBody }>
          { renderMarks(mark.semester)}
          { renderMarks(mark.final)}
        </View>
      </View>
    ))
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: theme.spacing.large,
  },
  listTitle: {
    padding        : theme.spacing.medium,
    backgroundColor: theme.colors.elevation.level3,
  },
  listBody: {
    flexDirection  : 'row',
    justifyContent : 'space-between',
    padding        : theme.spacing.extraSmall,
    backgroundColor: theme.colors.elevation.level2,
  },
  flexRow: {
    flexDirection: 'row',
  },
});
