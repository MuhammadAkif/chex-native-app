import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';

import {ButtonFooter, Custom_RBSheet, RenderStatuses} from './index';
import {Cross} from '../Assets/Icons';
import {colors} from '../Assets/Styles';
import {extract_StatusesCount, extractStatusesCount} from '../Utils/helpers';

const {gray} = colors;
const statusesInitialState = [
  {
    id: 1,
    name: 'Reviewed',
    count: 0,
    selected: true,
    key: 'reviewed',
  },
  {
    id: 2,
    name: 'In Review',
    count: 0,
    selected: true,
    key: 'in_review',
  },
  {
    id: 3,
    name: 'Ready For Review',
    count: 0,
    selected: true,
    key: 'ready_for_review',
  },
];

const Filter_RBSheet = ({filter, setFilter, inspections, setInspections}) => {
  const {inspectionReviewed, filter: filter_} = useSelector(
    state => state?.inspectionReviewed,
  );
  const rbSheetRef = useRef(null);
  const [statuses, setStatuses] = useState(statusesInitialState);

  const toggleFiler = {
    true: openSheet,
    false: closeSheet,
  };
  const activeSheet = toggleFiler[filter];
  useEffect(() => {
    activeSheet();
  }, [filter]);
  useEffect(() => {
    handleStatusesUpdate();
  }, [inspectionReviewed]);
  extract_StatusesCount(inspectionReviewed, filter_);
  function handleStatusesUpdate(inspectionsList = inspectionReviewed) {
    const counts = extractStatusesCount(inspectionsList);
    const updatedStatuses = statuses.map(status => ({
      ...status,
      count: counts[status.key] || 0,
    }));

    setStatuses(updatedStatuses);
  }

  function openSheet() {
    rbSheetRef.current.open();
  }
  function closeSheet() {
    rbSheetRef.current.close();
  }
  function handleStatusPress(item, index) {
    const updatedStatuses = statuses.map((status, i) =>
      i === index ? {...status, selected: !status.selected} : status,
    );
    setStatuses(updatedStatuses);
  }
  function changeFilter() {
    const selected_Status = [];
    for (let i = 0; i < statuses.length; i++) {
      const {selected, key} = statuses[i];
      if (selected) {
        selected_Status.push(key);
      }
    }
    setInspections(filteredInspections(selected_Status));
    setFilter(false);
  }
  const filteredInspections = selected_Status => {
    const status_ = [];
    for (let i = 0; i < inspectionReviewed.length; i++) {
      const {status} = inspectionReviewed[i];
      if (selected_Status.includes(status.toLowerCase())) {
        status_.push(inspectionReviewed[i]);
      }
    }
    return status_;
  };

  function handleApplyPress() {
    changeFilter();
  }
  function handleClearPress() {
    const resetStatuses = statuses.map(status => ({
      ...status,
      selected: true, // Reset to the default selected state
    }));
    setInspections(inspectionReviewed || []);
    setStatuses(resetStatuses);
    setFilter(false);
  }
  function handleCrossPress() {
    setFilter(false);
  }

  return (
    <Custom_RBSheet ref={rbSheetRef} useNativeDriver={false} height={hp('40%')}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter</Text>
          <TouchableOpacity onPress={handleCrossPress}>
            <Cross height={hp('6%')} width={wp('6%')} color={gray} />
          </TouchableOpacity>
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
