import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Cross } from '../Assets/Icons';
import { colors } from '../Assets/Styles';
import AppText from './text';

const keyExtractor = (item, index) =>
  [item?.licensePlateNumber, item?.vin, item?.vehicleType].filter(Boolean).join('-') || `item-${index}`;

const RADIO_SIZE = 20;
const RADIO_INNER_SIZE = 10;

const isItemSelected = (selected, item) =>
  selected && selected.vin === item.vin && selected.vehicleType === item.vehicleType;

const ExistingVehicleDropDown = ({
  data = [],
  onSelect,
  onClose,
  containerStyle,
  listMaxHeight = 200,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const handleSelect = useCallback(
    item => {
      setSelectedItem(item);
      onSelect?.(item);

    },
    [onSelect],
  );

  const renderItem = useCallback(
    ({ item }) => {
      const selected = isItemSelected(selectedItem, item);
      return (
        <Pressable onPress={() => handleSelect(item)} style={styles.item}>
          <View style={styles.radioOuter}>
            {selected && <View style={styles.radioInner} />}
          </View>
          <AppText style={styles.itemText}>
            {item?.licensePlateNumber}
          </AppText>
        </Pressable>
      );
    },
    [handleSelect, selectedItem],
  );

  if (!data || data.length === 0) {return null;}

  const iconSize = 20;
  const overlap = iconSize / 4;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.dropdownWithClose}>
        <View style={[styles.listWrapper, { maxHeight: listMaxHeight }]}>
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            nestedScrollEnabled
            style={styles.list}
            showsVerticalScrollIndicator={true}
          />
        </View>
        <Pressable
          onPress={onClose}
          hitSlop={8}
          style={[styles.closeButton, { top: -overlap, right: -overlap - 5 }]}>
          <Cross height={iconSize} width={iconSize} color={colors.steelGray} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 1,
  },
  dropdownWithClose: {
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    zIndex: 11,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  label: {
    marginBottom: 6,
    color: colors.black,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#E0E0E0',
    minHeight: 48,
  },
  dropdownContainer: {},
  triggerText: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
  placeholder: {
    color: '#BDBDBD',
  },
  listWrapper: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 6,
    overflow: 'hidden',
    zIndex: 10,
  },
  list: {
    flexGrow: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  radioOuter: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.royalBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: RADIO_INNER_SIZE,
    height: RADIO_INNER_SIZE,
    borderRadius: RADIO_INNER_SIZE / 2,
    backgroundColor: colors.royalBlue,
  },
  itemText: {
    flex: 1,
    color: colors.black,
    fontSize: 14,
  },
});

export default ExistingVehicleDropDown;
