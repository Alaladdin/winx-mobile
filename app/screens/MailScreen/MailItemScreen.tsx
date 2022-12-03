import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, DataTable } from 'react-native-paper';
import { groupBy, map, keys } from 'lodash';
import { useMemo } from 'react';
import theme from '@/theme';
import { Icon } from '@/components';
import { IMail, IMailAttachment } from '@/screens/MailScreen/MailScreen.types';

export function MailItemScreen({ route }) {
  const { mail }: { mail: IMail } = route.params;

  const renderAttachCell = (attach?: IMailAttachment) => {
    if (!attach) return null;

    return (
      <DataTable.Cell>
        <Icon
          style={ styles.fileIcon }
          color={ theme.colors.primary }
          icon={ attach.icon }
        />
        <Text style={ styles.fileName }>
          { attach.name }
        </Text>
      </DataTable.Cell>
    );
  };

  const AttachmentsTag = useMemo(() => {
    const { attachments } = mail;
    const attachmentsCols = groupBy(keys(attachments), (index) => {
      const numIndex = parseInt(index, 10);

      return Math.round((numIndex + 1) / 2);
    });

    return map(attachmentsCols, ([firstIndex, secondIndex]) => {
      const uniqKey = [firstIndex, secondIndex].join('_');

      return (
        <DataTable.Row key={ uniqKey } borderless>
          { renderAttachCell(attachments[firstIndex]) }
          { renderAttachCell(attachments[secondIndex]) }
        </DataTable.Row>
      );
    });
  }, [mail.attachments]);

  return (
    <View>
      <View style={ styles.header }>
        <Text variant="titleLarge">{ mail.title }</Text>
      </View>

      <ScrollView contentContainerStyle={ styles.bodyContainer }>
        <View style={ styles.bodyHeaderContainer }>
          <View style={ styles.bodyMeta }>
            <Text>{ `Received at: ${mail.receivedAtFull}` }</Text>
            <Text>{ `From: ${mail.from}` }</Text>
          </View>
          { AttachmentsTag }
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
    backgroundColor: theme.colors.elevation.level4,
  },
  bodyHeaderContainer: {
    marginBottom: theme.spacing.medium,
  },
  bodyMeta: {
    padding: theme.spacing.medium,
  },
  body: {
    padding: theme.spacing.medium,
  },
  fileName: {
    marginLeft: theme.spacing.medium,
    color     : theme.colors.primary,
  },
  fileIcon: {
    marginRight: theme.spacing.tiny,
  },
  fullWidth: {
    width: '100%',
  },
});
