import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../Assets/Styles';
import {ALIGNMENT_PHASES} from '../../../Utils/helpers';

const {black} = colors;

const InstructionsPanel = ({phase}) => {
  const currentPhase = ALIGNMENT_PHASES.find(p => p.id === phase);

  if (!currentPhase) {
    return null;
  }

  return (
    <View style={styles.instructionsPanel}>
      <Text style={styles.instructionTitle}>Phase Instructions:</Text>
      <Text style={styles.instructionDescription}>
        {currentPhase.description}
      </Text>
      <View style={styles.instructionsList}>
        {currentPhase.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  instructionsPanel: {
    backgroundColor: '#E3F2FD',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginVertical: wp('2%'),
  },
  instructionTitle: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
    marginBottom: wp('1%'),
  },
  instructionDescription: {
    fontSize: hp('1.8%'),
    color: '#37474F',
    marginBottom: wp('2%'),
  },
  instructionsList: {
    gap: wp('1%'),
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: wp('2%'),
  },
  bulletPoint: {
    fontSize: hp('1.8%'),
    color: '#1976D2',
    marginRight: wp('2%'),
    marginTop: -wp('0.5%'),
  },
  instructionText: {
    fontSize: hp('1.8%'),
    color: '#37474F',
    flex: 1,
  },
});

export default InstructionsPanel;
