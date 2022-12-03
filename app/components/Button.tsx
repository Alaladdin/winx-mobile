import { Button as ButtonComponent, IconButton, ButtonProps, IconButtonProps } from 'react-native-paper';
import { useCallback, useMemo } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import theme from '@/theme';
import { Icon } from '@/components/Icon';

type ButtonVariant = 'danger'

interface IButtonProps extends Omit<ButtonProps, 'theme' | 'children' | 'icon'> {
  text: string;
  variant?: ButtonVariant;
}

interface IIconButtonProps extends Omit<IconButtonProps, 'theme' | 'icon'> {
  icon?: IconProp;
  iconSize?: number;
  variant?: ButtonVariant;
}

export function Button({ variant, icon, text, iconSize, ...props }: IIconButtonProps| IButtonProps) {
  const variantStyle = useMemo(() => {
    const variantData = { color: '', buttonColor: '' };

    if (variant === 'danger')
      variantData.color = theme.colors.error;

    return variantData;
  }, [variant]);

  const buttonIcon = useCallback(({ color }) => {
    if (!icon) return null;

    return <Icon icon={ icon } color={ color } size={ iconSize || 14 } />;
  }, [icon, iconSize]);

  if (!text) {
    return (
      <IconButton
        { ...props }
        icon={ buttonIcon }
        mode="contained"
      />
    );
  }

  return (
    <ButtonComponent
      { ...props }
      textColor={ variantStyle.color }
    >
      { text }
    </ButtonComponent>
  );
}
