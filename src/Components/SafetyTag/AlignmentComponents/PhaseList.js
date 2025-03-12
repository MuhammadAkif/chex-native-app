import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../Assets/Styles';
import {ALIGNMENT_PHASES} from '../../../Utils/helpers';

const {black} = colors;

const PhaseList = ({currentPhase}) => {
  const getCurrentPhaseIndex = () => {
    const index = ALIGNMENT_PHASES.findIndex(
      phase => phase.id === currentPhase,
    );
    return index === -1 ? 0 : index;
  };

  return (
    <View style={styles.phaseListContainer}>
      <Text style={styles.phaseListTitle}>Alignment Phases</Text>
      {ALIGNMENT_PHASES.map((phase, index) => {
        const isCurrentPhase = phase.id === currentPhase;
        const isCompleted = index < getCurrentPhaseIndex();
        const isPending = index > getCurrentPhaseIndex();

        return (
          <View key={phase.id} style={styles.phaseItem}>
            <View style={styles.phaseHeader}>
              <View
                style={[
                  styles.phaseStatus,
                  isCompleted && styles.completed,
                  isCurrentPhase && styles.current,
                  isPending && styles.pending,
                ]}>
                {isCompleted && <Text style={styles.statusIcon}>✓</Text>}
                {isCurrentPhase && <Text style={styles.statusIcon}>▶</Text>}
              </View>
              <Text
                style={[
                  styles.phaseTitle,
                  isCurrentPhase && styles.currentPhaseTitle,
                ]}>
                {phase.title}
              </Text>
            </View>
            {isCurrentPhase && (
              <Text style={styles.phaseDescription}>{phase.description}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  phaseListContainer: {
    marginVertical: wp('2%'),
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    padding: wp('2%'),
  },
  phaseListTitle: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
    marginBottom: wp('2%'),
  },
  phaseItem: {
    marginBottom: wp('2%'),
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp('1%'),
  },
  phaseStatus: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('3%'),
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2%'),
  },
  completed: {
    backgroundColor: colors.brightGreen,
  },
  current: {
    backgroundColor: colors.cobaltBlue,
  },
  pending: {
    backgroundColor: colors.gray,
  },
  statusIcon: {
    flex: 1,
    color: colors.white,
    textAlign: 'center',
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
  },
  phaseTitle: {
    fontSize: hp('1.8%'),
    color: black,
  },
  currentPhaseTitle: {
    fontWeight: 'bold',
  },
  phaseDescription: {
    fontSize: hp('1.6%'),
    color: '#666',
    marginLeft: wp('8%'),
  },
});

export default PhaseList;
