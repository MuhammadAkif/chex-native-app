import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Keyboard, TouchableOpacity, Platform, TouchableWithoutFeedback } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useTranslation } from 'react-i18next';

import { PrimaryGradientButton } from '../index';
import CustomInput from '../CustomInput';
import { circleBorderRadius, colors, modalStyle } from '../../Assets/Styles';
import { Cross } from '../../Assets/Icons';

const { orange, white, royalBlue, black } = colors;
const { modalOuterContainer, container, yesText } = modalStyle;

const MakeYearModelModal = ({
    visible = true,
    title = 'Vehicle Detail',
    onConfirmPress,
    onEditPress,
    onClosePress,
    isLoading = false,
    defaultValues = { vin: '', make: '', model: '', year: '' },
}) => {
    const { t } = useTranslation();

    const [values, setValues] = useState(defaultValues);
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        setValues(defaultValues);
    }, [defaultValues]);

    const onTouchDismissKeyboard = () => Keyboard.dismiss();

    const handleInputChange = (field) => (text) => {
        setValues((prev) => ({ ...prev, [field]: text }));
    };

    const handleEditPress = () => {
        setIsEditable(true);
        onEditPress?.(values);
    };

    return (
        <View>
            <Modal animationType="slide" statusBarTranslucent transparent={true} visible={visible} style={modalOuterContainer}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <TouchableOpacity style={container} activeOpacity={1} onPress={onTouchDismissKeyboard}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                <TouchableOpacity style={styles.crossIcon} onPress={onClosePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Cross height={hp('2%')} width={hp('2%')} color={black} />
                                </TouchableOpacity>

                                <Text style={styles.headerTitle}>
                                    {title === 'Vehicle Detail' ? t('confirmVehicleDetail.title') : title}
                                </Text>

                                <View style={styles.inputsWrapper}>
                                    <CustomInput
                                        label={t('vehicleInfo.vinLabel')}
                                        value={values.vin}
                                        valueName={'vin'}
                                        onChangeText={handleInputChange}
                                        inputContainerStyle={styles.inputContainer}
                                        inputStyle={styles.inputStyle}
                                        editable={isEditable && !isLoading}
                                        maxLength={17}

                                    />
                                    <View style={styles.spacer} />
                                    <CustomInput
                                        label={t('vehicleInfo.makeLabel')}
                                        value={values.make}
                                        valueName={'make'}
                                        onChangeText={handleInputChange}
                                        inputContainerStyle={styles.inputContainer}
                                        inputStyle={styles.inputStyle}
                                        editable={isEditable && !isLoading}
                                        maxLength={30}
                                    />
                                    <View style={styles.spacer} />
                                    <CustomInput
                                        label={t('vehicleInfo.modelLabel')}
                                        value={values.model}
                                        valueName={'model'}
                                        onChangeText={handleInputChange}
                                        inputContainerStyle={styles.inputContainer}
                                        inputStyle={styles.inputStyle}
                                        editable={isEditable && !isLoading}
                                        maxLength={30}
                                    />
                                    <View style={styles.spacer} />
                                    <CustomInput
                                        label={t('vehicleInfo.yearLabel')}
                                        value={String(values.year || '')}
                                        valueName={'year'}
                                        onChangeText={handleInputChange}
                                        inputContainerStyle={styles.inputContainer}
                                        inputStyle={styles.inputStyle}
                                        keyboardType="numeric"
                                        editable={isEditable && !isLoading}
                                        maxLength={4}
                                    />
                                </View>

                                <View style={styles.footerContainer}>
                                    <PrimaryGradientButton
                                        text={t('common.confirm')}
                                        disabled={isLoading}
                                        buttonStyle={styles.confirmButton}
                                        textStyle={yesText}
                                        onPress={() => onConfirmPress?.(values)}
                                    />
                                    <TouchableOpacity
                                        disabled={isLoading}
                                        style={styles.editButton}
                                        onPress={handleEditPress}>
                                        <Text style={[yesText, { color: white }]}>{t('common.edit')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: wp('85%'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        paddingVertical: hp('3%'),
        paddingHorizontal: wp('5%'),
        borderRadius: 10,
    },
    crossIcon: {
        backgroundColor: 'transparent',
        borderRadius: circleBorderRadius,
        position: 'absolute',
        top: hp('1.5%'),
        right: wp('3%'),
        padding: hp('0.8%'),
        zIndex: 10,
    },
    headerTitle: {
        fontSize: hp('2.2%'),
        color: colors.black,
        fontWeight: 'bold',
        marginBottom: hp('2%'),
    },
    inputsWrapper: {
        width: '100%',
    },
    spacer: {
        height: hp('1.5%'),
    },
    inputContainer: {
        backgroundColor: white,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 3,
        width: '100%',
        height: hp('4%'),
        paddingHorizontal: wp('2%'),
    },
    inputStyle: {
        height: hp('5.5%'),
        fontSize: hp('1.8%'),
    },
    footerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: hp('3%'),
    },
    confirmButton: {
        height: hp('5.5%'),
        width: wp('32%'),
        borderRadius: 5,
    },
    editButton: {
        height: hp('5.5%'),
        width: wp('32%'),
        backgroundColor: royalBlue,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
});

export default MakeYearModelModal;
