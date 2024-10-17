import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';

import {ButtonFooter, Custom_RBSheet, RenderStatuses} from './index';
import {Cross} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {extractStatusesCount} from '../Utils/helpers';

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

const Filter_RBSheet = ({filter}) => {
  const inspectionReviewed = useSelector(state => state?.inspectionReviewed);
  const rbSheetRef = useRef(null);
  const [statuses, setStatuses] = useState(statusesInitialState);

  useEffect(() => {
    openSheet();
  }, []);
  useEffect(() => {
    handleStatusesUpdate();
  }, [inspectionReviewed]);

  function handleStatusesUpdate() {
    const counts = extractStatusesCount(inspectionReviewed);
    const updatedStatuses = statuses.map(status => ({
      ...status,
      count: counts[status.name.toLowerCase().replace(/\s/g, '_')] || 0,
    }));

    setStatuses(updatedStatuses);
  }

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
  const handleStatusPress = (item, index) => {
    const updatedStatuses = statuses.map((status, i) =>
      i === index ? {...status, selected: !status.selected} : status,
    );
    setStatuses(updatedStatuses);
  };

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
