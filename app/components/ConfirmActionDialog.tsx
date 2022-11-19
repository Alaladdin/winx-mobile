import { Dialog, DialogProps } from 'react-native-paper';
import { ReactNode, useCallback } from 'react';
import { Button } from '@/components/Button';
import { translate } from '@/i18n';

interface IConfirmActionDialogProps extends Omit<DialogProps, 'theme'> {
  visible: boolean;
  title: ReactNode;
  onConfirm: () => void;
}

export function ConfirmActionDialog({ title, children, onConfirm, onDismiss, ...props }: IConfirmActionDialogProps) {
  const confirm = useCallback(() => {
    onDismiss();
    onConfirm();
  }, [onConfirm, onDismiss]);

  return (
    <Dialog
      { ...props }
      onDismiss={ onDismiss }
    >
      <Dialog.Title>
        { title }
      </Dialog.Title>

      { children && (
        <Dialog.Content>
          { children }
        </Dialog.Content>
      )}

      <Dialog.Actions>
        <Button
          text={ translate('common.confirm') }
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
