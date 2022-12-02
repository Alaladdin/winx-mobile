import { ProgressBar, Searchbar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components';
import theme from '@/theme';

interface IMailHeaderProps {
  search: string;
  canUpdate?: boolean;
  isLoading?: boolean;
  onSearchChange: (search) => any;
  onUpdate: () => any;
  onRemove: () => any;
}

export function MailHeader(props: IMailHeaderProps) {
  return (
    <View>
      <ProgressBar visible={ props.isLoading } indeterminate />
      <View style={ styles.header }>
        <Button
          icon="rotate-right"
          disabled={ !props.canUpdate }
          onPress={ props.onUpdate }
        />
        <Searchbar
          style={ styles.searchBar }
          value={ props.search }
          placeholder="Search"
          onChangeText={ props.onSearchChange }
        />
        <Button
          icon="trash-can"
          onPress={ props.onRemove }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    paddingHorizontal: theme.spacing.extraSmall,
    paddingVertical  : theme.spacing.extraSmall,
    backgroundColor  : theme.colors.elevation.level3,
    zIndex           : 1,
  },
  searchBar: {
    borderRadius: 100,
    width       : '65%',
    height      : '80%',
  },
});
