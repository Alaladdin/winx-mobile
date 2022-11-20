import { Button as ButtonComponent, ButtonProps } from 'react-native-paper';
import { useMemo } from 'react';
import theme from '@/theme';

type IButtonVariant = 'danger'

interface IButtonProps extends Omit<ButtonProps, 'theme' | 'children'> {
  text: string;
  variant?: IButtonVariant;
}

export function Button({ text, variant, ...props }: IButtonProps) {
  const variantStyle = useMemo(() => {
    const variantData = { color: '', buttonColor: '' };

    if (variant === 'danger')
      variantData.color = theme.colors.error;

    return variantData;
  }, [variant]);

  return (
    <ButtonComponent
      { ...props }
      textColor={ variantStyle.color }
    >
      { text }
    </ButtonComponent>
  );
}
