import * as React from 'react';
import { Button, Menu } from 'react-native-paper';
import { map, find } from 'lodash/collection';
import { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Icon } from './Icon';

interface ISelectOption {
  title: string
  value: string
  icon?: IconProp
}

interface ISelectProps {
  value: string;
  options: ISelectOption[];
  disabled?: boolean
  onChange?: (string) => void
}

export function Select(props: ISelectProps) {
  const { value, options, disabled, onChange } = props;
  const [visible, setVisible] = useState(false);
  const setValue = (newVal) => {
    onChange?.(newVal);
    closeMenu();
  };
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const currentValue = find(options, { value });
  const renderIcon = ({ icon, color, size }) => icon && <Icon icon={ icon } color={ color } size={ size } />;

  useEffect(() => {
    if (!currentValue && options.length)
      setValue(options[0].value);
  }, []);

  return (
    <Menu
      visible={ visible }
      onDismiss={ closeMenu }
      anchor={ (
        <Button
          onPress={ openMenu }
          icon={ (iconProps) => renderIcon({
            ...iconProps,
            ...currentValue,
            size: 12,
          }) }
          disabled={ disabled }
        >
          { currentValue.title }
        </Button>
    ) }
    >
      {
        map(options, (option) => (
          <Menu.Item
            key={ option.value }
            onPress={ () => setValue(option.value) }
            title={ option.title }
            leadingIcon={ (iconProps) => renderIcon({
              ...iconProps,
              ...option,
              size: 15,
            }) }
          />
        ))
      }
    </Menu>
  );
}
