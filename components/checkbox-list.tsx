import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Checkbox, useTheme } from 'react-native-paper';

import { usePreferences } from '@/contexts/preferencesContext';
import { CheckboxListProps } from '@/types/types';

export const CheckboxList = <T extends string>({
  title,
  items,
  selectedItems,
  setSelectedItems,
  maxSelection = Infinity,
  minSelection = 0,
  style,
}: CheckboxListProps<T>) => {
  const { colors } = useTheme();
  const selectedCount = Object.values(selectedItems).filter(Boolean).length;
  const { isThemeDark } = usePreferences();

  return (
    <View
      style={[
        styles.panel,
        { ...style },
        { borderColor: colors.onPrimary, borderWidth: 2, backgroundColor: isThemeDark ? '#0003' : '#0002' },
      ]}
    >
      <Text style={[styles.title, { fontFamily: 'Roboto_500Medium', marginVertical: 5, color: colors.onPrimary }]}>
        {title}
      </Text>
      {Object.entries(items).map(([key, label]) => {
        const typedKey = key as T;
        const isChecked = selectedItems[typedKey];
        const disabled =
          (isChecked && selectedCount === minSelection) || (!isChecked && selectedCount === maxSelection);

        return (
          <View key={key} style={[styles.checkboxContainer, {}]}>
            <Checkbox
              status={isChecked ? 'checked' : 'unchecked'}
              onPress={() => {
                setSelectedItems((prev) => ({
                  ...prev,
                  [typedKey]: !isChecked,
                }));
              }}
              uncheckedColor={colors.onPrimary}
              disabled={disabled}
            />
            <Text
              style={{
                // @ts-ignore
                color: disabled ? colors.checkboxDisabled : colors.onPrimary,
                marginLeft: 5,
                fontFamily: 'Roboto_400Regular',
              }}
            >
              {
                // @ts-ignore
                label.toUpperCase()
              }
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'column',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
