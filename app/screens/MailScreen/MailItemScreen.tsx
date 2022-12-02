import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { map } from 'lodash';
import theme from '@/theme';
import { Icon } from '@/components';

export function MailItemScreen({ route }) {
  const { mail } = route.params;

  return (
    <View>
      <View style={ styles.header }>
        <Text variant="titleLarge">{ mail.title }</Text>
      </View>

      <ScrollView style={ styles.bodyContainer } contentContainerStyle={ { paddingBottom: theme.spacing.huge } }>
        <View style={ styles.bodyHeaderContainer }>
          <View style={ { marginBottom: theme.spacing.small } }>
            <Text>{ `Received at: ${mail.receivedAt}` }</Text>
            <Text>{ `From: ${mail.from}` }</Text>
          </View>
          {
          map(mail.attachments, (attach, index) => (
            <View key={ index } style={ styles.attachContainer }>
              <Text style={ styles.fileName }>{ attach.name }</Text>
              <Icon color={ theme.colors.primary } icon={ attach.icon } />
            </View>
          ))
        }
        </View>

        <Text style={ styles.body }>
          { mail.body }
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding        : theme.spacing.medium,
    backgroundColor: theme.colors.elevation.level2,
  },
  bodyContainer: {
    // marginBottom   : theme.spacing.huge,
    backgroundColor: theme.colors.elevation.level4,
  },
  body: {
    padding        : theme.spacing.medium,
    backgroundColor: theme.colors.elevation.level4,
  },
  bodyHeaderContainer: {
    marginBottom: theme.spacing.medium,
    padding     : theme.spacing.medium,
  },
  attachContainer: {
    flexDirection: 'row',
  },
  fileName: {
    marginRight: theme.spacing.extraSmall,
    color      : theme.colors.primary,
  },
});
