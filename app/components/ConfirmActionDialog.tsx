import { Dialog, DialogProps, Text } from 'react-native-paper';
import { ReactNode, useCallback, useMemo } from 'react';
import { Button } from '@/components/Button';
import { translate } from '@/i18n';

interface IConfirmActionDialogProps extends Omit<DialogProps, 'theme' | 'children'> {
  visible: boolean;
  title: ReactNode;
  body?: string;
  children?: ReactNode;
  onConfirm: () => void;
}

export function ConfirmActionDialog({ title, body, children, onConfirm, onDismiss, ...props }: IConfirmActionDialogProps) {
  const confirm = useCallback(() => {
    onDismiss();
    onConfirm();
  }, [onConfirm, onDismiss]);

  const DialogBody = useMemo(() => {
    if (!children && !body) return false;
    const content = children || <Text>{ body }</Text>;

    return (
      <Dialog.Content>
        { content }
      </Dialog.Content>
    );
  }, [children, body]);

  return (
    <Dialog
      { ...props }
      onDismiss={ onDismiss }
    >
      <Dialog.Title>
        { title }
      </Dialog.Title>

      { DialogBody }

      <Dialog.Actions>
        <Button
          text={ translate('common.confirm') }
          variant="danger"
          onPress={ confirm }
        />

        <Button
          text={ translate('common.cancel') }
          onPress={ onDismiss }
        />
      </Dialog.Actions>
    </Dialog>
  );
}
