import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { usePreferences } from '@/contexts/preferencesContext';
import { CurrencyKey, TickerKey, CheckboxListProps } from '@/types/types';
import { Checkbox, useTheme, Text, Modal, Portal, Button } from 'react-native-paper';

import { useCoins } from '@/contexts/coinsContext';
import { isCurrencyKey, isTickerKey } from '@/utils/utils';

export const CheckboxList = <T extends string>({
  title,
  items,
  selectedItems,
  setSelectedItems,
  maxSelection = Infinity,
  minSelection = 0,
  selectedKey,
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
        { borderColor: colors.onPrimary, borderWidth: 2, backgroundColor: isThemeDark ? '#0003' : '#eee1' },
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
          <View key={key} style={[styles.checkboxContainer, { marginVertical: 1 }]}>
            <View style={[styles.checkboxAndLabel, {}]}>
              <Checkbox.Android
                status={isChecked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setSelectedItems((prev) => ({
                    ...prev,
                    [typedKey]: !isChecked,
                  }));
                }}
                mode="android"
                uncheckedColor={colors.onPrimary}
                disabled={disabled}
                color={disabled ? colors.checkboxDisabled : isChecked ? colors.primary : colors.onPrimary}
                theme={(colors.onSurfaceDisabled = colors.checkboxDisabled)}
                // color={
                //   disabled
                //     ? selectedKey === typedKey
                //       ? colors.checkboxDisabledSelected // Case 1: Disabled & Selected → Use checkboxDisabledSelected color
                //       : colors.checkboxDisabled // Case 2: Disabled but NOT selected → Use checkboxDisabled color
                //     : selectedKey === typedKey
                //     ? colors.primary // Case 3: Not Disabled & Selected → Use primary color
                //     : colors.onPrimary
                // }
              />
              <Text
                style={{
                  // @ts-ignore
                  color: disabled ? colors.checkboxDisabled : colors.onPrimary,

                  marginLeft: 5,
                  fontFamily: selectedKey === typedKey ? 'Roboto_700Bold' : 'Roboto_400Regular',
                }}
                variant={selectedKey === typedKey ? 'labelLarge' : 'labelMedium'}
              >
                {
                  // @ts-ignore
                  label.toUpperCase()
                }
              </Text>
            </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxAndLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
