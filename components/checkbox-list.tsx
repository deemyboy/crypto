import { usePreferences } from '@/contexts/preferencesContext';
import { CurrencyKey, TickerKey } from '@/types/types';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox, useTheme, Text, Modal, Portal, Button } from 'react-native-paper';

import { useCoins } from '@/contexts/coinsContext';
import { isCurrencyKey, isTickerKey } from '@/utils/utils';

interface CheckboxListProps<T extends string> {
  title: string;
  items: Record<T, string>;
  selectedItems: Record<T, boolean>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Record<T, boolean>>>;
  maxSelection?: number;
  minSelection?: number;
  selectedKey: TickerKey | CurrencyKey;
  style?: object;
}

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
  const { handleCurrencyChange, handleTickerSelect } = useCoins();

  const [isModalVisible, setModalVisible] = useState(false);
  console.log('🚀  |  file: checkbox-list.tsx:37  |  isModalVisible:', isModalVisible);
  const [newSelectedKey, setNewSelectedKey] = useState<TickerKey | CurrencyKey | null>(null);

  const handleCheckboxPress = (typedKey: T, isChecked: boolean) => {
    if (isChecked) {
      setSelectedItems((prev) => ({
        ...prev,
        [typedKey]: !isChecked,
      }));
    } else {
      // If unchecking thtypedKeye selected item, show the modal
      setNewSelectedKey(); // Store the item to uncheck
      setModalVisible(true); // Show the modal
    }
  };

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
          <View key={key} style={[styles.checkboxContainer, { backgroundColor: 'transparent', marginVertical: 1 }]}>
            <View style={[styles.checkboxAndLabel, { backgroundColor: 'transparent' }]}>
              <Checkbox
                status={isChecked ? 'checked' : 'unchecked'}
                // onPress={() => {
                //   setSelectedItems((prev) => ({
                //     ...prev,
                //     [typedKey]: !isChecked,
                //   }));
                // }}
                uncheckedColor={colors.onPrimary}
                disabled={disabled}
                onPress={() => handleCheckboxPress(typedKey, isChecked)} // Calling the updated function
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
