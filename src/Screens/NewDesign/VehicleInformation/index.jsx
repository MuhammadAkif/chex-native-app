import {View, StatusBar, ScrollView, Image, Pressable} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {CardWrapper, CustomInput, LogoHeader} from '../../../Components';
import AppText from '../../../Components/text';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {colors} from '../../../Assets/Styles';
import {IMAGES} from '../../../Assets/Images';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

const VehicleInformation = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(1);

  const VehicleTypes = [
    {id: 1, name: 'VAN', image: IMAGES.Van},
    {id: 2, name: 'TRUCK', image: IMAGES.Truck},
    {id: 3, name: 'SEDAN', image: IMAGES.Sedan},
  ];

  return (
    <View style={styles.blueContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer} style={styles.container}>
        {/* BLUE HEADER */}
        <View style={styles.blueHeaderContainer}>
          <LogoHeader />
        </View>

        {/* WHITE CONTAINER */}
        <CardWrapper style={styles.whiteContainerContent}>
          <View style={styles.infoContainer}>
            <AppText fontSize={wp(4.5)} fontWeight={'600'}>
              Vehicle Information
            </AppText>
            <AppText fontSize={wp(3)} color={colors.steelGray}>
              Please provide the vehicle information below to begin your inspection. All fields are required to ensure accurate compliance.
            </AppText>
          </View>

          <View style={styles.vehicleTypeContainer}>
            {/* VEHICLES */}

            <View>
              <AppText style={styles.vehicleTypeText}>Vehicle Type</AppText>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.vehicleTypeContentList}>
                {VehicleTypes.map(v => (
                  <Pressable
                    onPress={() => setSelectedVehicle(v.id)}
                    activeOpacity={0.7}
                    key={v.id}
                    style={[styles.vehicleItemContainer, {backgroundColor: selectedVehicle == v.id ? colors.royalBlue : '#E7EFF8'}]}>
                    <View style={styles.vehicleItemImageContainer}>
                      <Image source={v.image} style={styles.vehicleImg} />
                    </View>

                    <View style={styles.vehicleItemName}>
                      <AppText fontWeight={'700'} color={selectedVehicle == v.id ? colors.white : colors.steelGray}>
                        {v.name}
                      </AppText>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* INPUTS */}
            <View style={styles.inputsContainer}>
              <CustomInput label="Truck ID/License Plate" />
            </View>
          </View>
        </CardWrapper>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default VehicleInformation;
