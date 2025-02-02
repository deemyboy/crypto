import { useEffect, useRef, useState } from 'react';
import { ViewStyle, Dimensions, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { AntDesign } from '@expo/vector-icons';

import { SPECS_TICKERS } from '@/constants/Api';
import { useCoins } from '@/contexts/coinsContext';
import { TickerKey, Option } from '@/types/types';
import { useTheme } from 'react-native-paper';

interface TickerPickerProps {
  tickerKey: TickerKey;
  onTickerChange: (ticker: TickerKey) => void;
  options: Option[];
}

export const TickerPicker = ({ tickerKey, onTickerChange, options }: TickerPickerProps) => {
  const theme = useTheme();
  const { colors } = theme;

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(options);
  const [value, setValue] = useState<string | null>(null);

  const isFirstRender = useRef(true);

  const handleValueChange = (newValue: string | null) => {
    if (newValue && newValue in SPECS_TICKERS) {
      onTickerChange(newValue as TickerKey);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (value) handleValueChange(value);
  }, [value]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (options) setItems(options);
  }, [options]);

  useEffect(() => {
    if (!value) setValue(tickerKey);
  }, []);

  useEffect(() => {
    if (!options.some((option) => option.value === value)) {
      setValue(options.length > 0 ? options[0].value : null);
    }
  }, [options]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      containerStyle={{}}
      style={[
        styles.dropdownPicker,
        {
          borderColor: colors.primary,
          backgroundColor: 'transparent',
        },
      ]}
      textStyle={{
        paddingLeft: 10,
        color: colors.onBackground,
        fontFamily: 'Roboto_500Medium',
      }}
      //  @ts-ignore
      tickIconStyle={{ tintColor: colors.onBackground }}
      //  @ts-ignore
      arrowIconStyle={{ tintColor: colors.onBackground }}
      ArrowUpIconComponent={() => (
        <AntDesign name="caretup" size={16} style={{ left: -10 }} color={colors.onBackground} />
      )}
      ArrowDownIconComponent={() => (
        <AntDesign name="caretdown" size={16} style={{ left: -10 }} color={colors.onBackground} />
      )}
    />
  );
};

const styles = StyleSheet.create<{
  dropdownPicker: ViewStyle;
}>({
  dropdownPicker: {
    height: 50,
    borderRadius: 40,
    borderWidth: 2,
  },
});
