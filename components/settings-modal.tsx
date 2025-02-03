import { usePreferences } from '@/contexts/preferencesContext';
import { CurrencyKey, TickerKey } from '@/types/types';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox, useTheme, Text, Modal, Portal, Button } from 'react-native-paper';

import { useCoins } from '@/contexts/coinsContext';
import { isCurrencyKey, isTickerKey } from '@/utils/utils';

type SettingsModalProps = {};

export const SettingsModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  console.log('🚀  |  file: checkbox-list.tsx:37  |  isModalVisible:', isModalVisible);

  const handleNewSelection = (newSelectionKey: TickerKey | CurrencyKey) => {
    if (isCurrencyKey(newSelectionKey)) {
      handleCurrencyChange(newSelectionKey); // Treat as Currency
    } else if (isTickerKey(newSelectionKey)) {
      handleTickerSelect(newSelectionKey); // Treat as Ticker
    }
  };

  return (
    <Portal>
      <Modal
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={modalStyles.modalContainer}
      >
        <Text style={modalStyles.modalText}>The selected item has been removed. Please pick a new item.</Text>
        <Button
          onPress={() => {
            if (newSelectedKey) {
              handleNewSelection(newSelectedKey); // Safely handle new selection
              setModalVisible(false); // Close modal after selection
            }
          }}
        >
          Select New Item
        </Button>
      </Modal>
    </Portal>
  );
};
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  option: {
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
  selected: {
    fontWeight: 'bold',
    color: 'blue',
  },
});
