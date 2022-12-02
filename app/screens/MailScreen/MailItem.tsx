import { Avatar, List, Text, TouchableRipple } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { Icon } from '@/components';
import theme from '@/theme';
import { IMail } from './MailScreen.types';

interface IMailItemProps {
  mail: IMail;
  onPress: (mail: IMail) => any;
}

export function MailItem({ mail, onPress }: IMailItemProps) {
  const description = useMemo(() => {
    let text = mail.from;

    if (mail.body)
      text += `\n${mail.body}`;

    return text;
  }, [mail.from, mail.body]);

  const avatarImage = useMemo(() => (
    <View style={ styles.avatarContainer }>
      <Avatar.Text label={ mail.from[0] } size={ 30 } />
    </View>
  ), [mail.from]);

  const itemRight = useMemo(() => {
    const hasAttachments = !!mail.attachments?.length;

    return (
      <View style={ styles.itemRight }>
        { hasAttachments && (<Icon containerStyle={ styles.file } icon="file" />) }
        <Text>{ mail.receivedAt }</Text>
      </View>
    );
  }, [mail.attachments, mail.receivedAt]);

  return (
    <TouchableRipple
      key={ mail._id }
      style={ styles.item }
      borderless
      onPress={ () => onPress(mail) }
    >
      <List.Item
        title={ mail.title }
        description={ description }
        left={ () => avatarImage }
        right={ () => itemRight }
      />
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: theme.colors.elevation.level3,
  },
  itemRight: {
    flexDirection : 'row',
    alignItems    : 'flex-start',
    justifyContent: 'flex-end',
    marginLeft    : theme.spacing.extraSmall,
    marginTop     : theme.spacing.extraSmall,
    width         : '20%',
  },
  avatarContainer: {
    marginTop  : theme.spacing.extraSmall,
    marginRight: theme.spacing.tiny,
  },
  file: {
    flex       : 0,
    marginRight: theme.spacing.tiny,
  },
});
