import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {ButtonFooter, Custom_RBSheet, RenderStatuses} from './index';
import {Cross} from '../Assets/Icons';
import {colors} from '../Assets/Styles';

const {gray} = colors;
const statusesInitialState = [
  {
    id: 1,
    name: 'Reviewed',
    count: 0,
    selected: true,
  },
  {
    id: 2,
    name: 'In Review',
    count: 0,
    selected: false,
  },
  {
    id: 3,
    name: 'Ready For Review',
    count: 0,
    selected: true,
  },
];

const Filter_RBSheet = props => {
  const [statuses, setStatuses] = useState(statusesInitialState);
  const {filter} = props;
  const rbSheetRef = useRef(null);
  useEffect(() => {
    filter ? openSheet() : closeSheet();
  }, []);

  const openSheetPress = () => {
    openSheet();
  };
  const closeSheetPress = () => {
    closeSheet();
  };
  function openSheet() {
    rbSheetRef.current.open();
  }
  function closeSheet() {
    rbSheetRef.current.close();
  }
  function handleApplyPress() {}
  function handleClearPress() {}
  function handleStatusPress() {}

  return (
    <Custom_RBSheet ref={rbSheetRef} useNativeDriver={false} height={hp('40%')}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter</Text>
          <Cross height={hp('5%')} width={wp('5%')} color={gray} />
        </View>
        <View style={styles.body}>
          <FlatList
            data={statuses}
            renderItem={({item, index}) => (
              <RenderStatuses
                item={item}
                index={index}
                onPress={handleStatusPress}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.footer}>
          <ButtonFooter
            yesText={'Apply'}
            noText={'Clear'}
            onYesPress={handleApplyPress}
            onNoPress={handleClearPress}
          />
        </View>
      </View>
    </Custom_RBSheet>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('3.5%'),
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    flex: 3,
  },
  footer: {
    flex: 2,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: hp('2%'),
  },
});
export default Filter_RBSheet;
