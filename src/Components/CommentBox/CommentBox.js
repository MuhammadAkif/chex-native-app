import React, {useState, useCallback, useEffect} from 'react';
import {Keyboard, Modal, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import InputField from './InputField';
import TextLimit from './TextLimit';
import {modalStyle} from '../../Assets/Styles';
import {FooterButtons} from '../index';
import {fallBack} from '../../Utils';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

const {modalOuterContainer, header, body, modalContainer} = modalStyle;

const CommentBox = ({
  title = 'Add a Comment',
  description = 'Please provide your comments or feedback below',
  onSubmit = fallBack,
  onCancel = fallBack,
  placeHolder = 'Type your comment or feedback here',
  feedback = '',
  isLoading = false,
  textLimit = 500,
  visible = true,
}) => {
  const [input, setInput] = useState(feedback);

  useEffect(() => {
    if (feedback) {
      setInput(feedback);
    }
    return resetAllStates;
  }, [feedback, visible]);

  const resetAllStates = () => {
    setInput('');
  };

  const handleConfirm = useCallback(() => {
    onSubmit(input);
  }, [input, onSubmit]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const onPressModal = () => Keyboard.dismiss();

  return (
    <Modal
      animationType="slide"
      statusBarTranslucent
      backdropColor={'rgba(0,0,0,.5)'}
      style={modalOuterContainer}
      visible={visible}
      onPress={onPressModal}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}} keyboardShouldPersistTaps="handled">
          <View style={modalContainer}>
            <Text style={header}>{title}</Text>
            <Text style={[body, styles.subHeading]}>{description}</Text>

            <InputField
              value={input}
              onChange={setInput}
              placeholder={placeHolder}
              maxLength={textLimit}
              editable={!isLoading}
              onSubmitEditing={handleConfirm}
            />
            <TextLimit currentLength={input.length} maxLength={textLimit} />

            <FooterButtons disabledConfirm={input === feedback} onSubmit={handleConfirm} onCancel={handleCancel} isLoading={isLoading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  subHeading: {
    fontWeight: '400',
  },
});

export default React.memo(CommentBox);
