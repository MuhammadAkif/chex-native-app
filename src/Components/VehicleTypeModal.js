import React from 'react';
import {Modal, Text, View} from 'react-native';
import {modalStyle} from '../Assets/Styles';
import {PrimaryGradientButton} from './index';

const {
  modalOuterContainer,
  container,
  modalContainer,
  header,
  body,
  button,
  yesText,
} = modalStyle;

const buttonSpacing = {marginVertical: 6};

const VehicleTypeModal = ({visible, onSelect, loadingState}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      style={modalOuterContainer}>
      <View style={container}>
        <View style={modalContainer}>
          <Text style={header}>Select Vehicle Type</Text>
          <Text style={body}>
            Please choose the type of vehicle for this inspection.
          </Text>
          <View
            style={{
              flexDirection: 'column',
              width: '80%',
              paddingVertical: 10,
            }}>
            <PrimaryGradientButton
              text={'Van'}
              buttonStyle={[
                button,
                buttonSpacing,
                {width: '100%', alignSelf: 'center'},
              ]}
              textStyle={yesText}
              onPress={() => onSelect('Van')}
              disabled={
                loadingState?.vehicleType === 'Van'
                  ? loadingState.isLoading
                  : false
              }
            />
            <PrimaryGradientButton
              text={'Sedan'}
              buttonStyle={[
                button,
                buttonSpacing,
                {width: '100%', alignSelf: 'center'},
              ]}
              textStyle={yesText}
              onPress={() => onSelect('Sedan')}
              disabled={
                loadingState?.vehicleType === 'Sedan'
                  ? loadingState.isLoading
                  : false
              }
            />
            <PrimaryGradientButton
              text="Truck"
              buttonStyle={[
                button,
                buttonSpacing,
                {width: '100%', alignSelf: 'center'},
              ]}
              textStyle={yesText}
              onPress={() => onSelect('Truck')}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VehicleTypeModal;
