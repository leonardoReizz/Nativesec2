import * as Select from '@radix-ui/react-select';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { BsCheck } from 'react-icons/bs';
import React, { Fragment } from 'react';
import styles from './styles.module.sass';

interface RadixSelectProps {
  options: {
    id: string;
    name: string;
    items: {
      value: string;
      text: string;
    }[];
  }[];

  placeholder: string;
  ariaLabel: string;
  onClick: (value: string) => void;
  value: string;
}

export function RadixSelect({
  options,
  placeholder,
  ariaLabel,
  onClick,
  value,
}: RadixSelectProps) {
  return (
    <Select.Root onValueChange={(e) => onClick(e)} value={value}>
      <Select.Trigger aria-label={ariaLabel} className={styles.Trigger}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={styles.SelectIcon}>
          <BiChevronDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.content}>
          <Select.ScrollUpButton className={styles.SelectScrollButton}>
            <BiChevronUp />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.SelectViewport}>
            {options.map((option, index) => {
              return (
                <Fragment key={option.id}>
                  <Select.Group>
                    <Select.Label className={styles.SelectLabel}>
                      {option.name}
                    </Select.Label>
                    {option.items.map((item) => {
                      return (
                        <Select.Item
                          className={styles.SelectItem}
                          value={item.value}
                          key={item.value}
                        >
                          <Select.ItemText>{item.text}</Select.ItemText>
                          <Select.ItemIndicator
                            className={styles.SelectItemIndicator}
                          >
                            <BsCheck />
                          </Select.ItemIndicator>
                        </Select.Item>
                      );
                    })}
                  </Select.Group>
                  {index + 1 < options.length && (
                    <Select.Separator className={styles.SelectSeparator} />
                  )}
                </Fragment>
              );
            })}
          </Select.Viewport>
          <Select.ScrollDownButton className={styles.SelectScrollButton}>
            <BiChevronDown />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
