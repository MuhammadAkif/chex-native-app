import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../Assets/Styles';
import useDeviceInstructions from '../../hooks/useDeviceInstructions';

const {black, white, brightGreen, orange, gray} = colors;

const PrerequisiteItem = ({title, description, isRequired}) => (
  <View style={styles.prerequisiteItem}>
    <View style={styles.prerequisiteHeader}>
      <Text style={styles.prerequisiteTitle}>{title}</Text>
      {isRequired && <Text style={styles.requiredBadge}>Required</Text>}
    </View>
    <Text style={styles.prerequisiteDescription}>{description}</Text>
  </View>
);

const StepItem = ({title, description, status}) => (
  <View style={styles.stepItem}>
    <View style={styles.stepHeader}>
      <View
        style={[
          styles.stepStatus,
          status === 'completed' && styles.completed,
          status === 'in_progress' && styles.inProgress,
        ]}>
        {status === 'completed' && <Text style={styles.statusIcon}>✓</Text>}
        {status === 'in_progress' && <Text style={styles.statusIcon}>▶</Text>}
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
    </View>
    <Text style={styles.stepDescription}>{description}</Text>
  </View>
);

const TroubleshootingItem = ({issue, solutions}) => (
  <View style={styles.troubleshootingItem}>
    <Text style={styles.troubleshootingIssue}>{issue}</Text>
    {solutions.map((solution, index) => (
      <View key={index} style={styles.solutionItem}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={styles.solutionText}>{solution}</Text>
      </View>
    ))}
  </View>
);

const DeviceInstructions = () => {
  const {prerequisites, connectionSteps, alignmentSteps, troubleshootingTips} =
    useDeviceInstructions();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prerequisites</Text>
        {Object.values(prerequisites).map((prereq, index) => (
          <PrerequisiteItem key={index} {...prereq} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Steps</Text>
        {connectionSteps.map(step => (
          <StepItem key={step.id} {...step} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alignment Process</Text>
        {alignmentSteps.map(step => (
          <StepItem key={step.id} {...step} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Troubleshooting</Text>
        {troubleshootingTips.map(tip => (
          <TroubleshootingItem key={tip.id} {...tip} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  section: {
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: gray,
  },
  sectionTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: black,
    marginBottom: wp('3%'),
  },
  prerequisiteItem: {
    backgroundColor: '#F5F5F5',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: wp('2%'),
  },
  prerequisiteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp('1%'),
  },
  prerequisiteTitle: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
  },
  requiredBadge: {
    backgroundColor: orange,
    color: white,
    paddingHorizontal: wp('2%'),
    paddingVertical: wp('1%'),
    borderRadius: wp('1%'),
    fontSize: hp('1.5%'),
  },
  prerequisiteDescription: {
    fontSize: hp('1.8%'),
    color: black,
  },
  stepItem: {
    marginBottom: wp('3%'),
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp('1%'),
  },
  stepStatus: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('3%'),
    backgroundColor: gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2%'),
  },
  completed: {
    backgroundColor: brightGreen,
  },
  inProgress: {
    backgroundColor: orange,
  },
  statusIcon: {
    color: white,
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
  },
  stepDescription: {
    fontSize: hp('1.8%'),
    color: black,
    marginLeft: wp('8%'),
  },
  troubleshootingItem: {
    backgroundColor: '#F5F5F5',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: wp('2%'),
  },
  troubleshootingIssue: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: black,
    marginBottom: wp('2%'),
  },
  solutionItem: {
    flexDirection: 'row',
    marginBottom: wp('1%'),
  },
  bulletPoint: {
    fontSize: hp('1.8%'),
    color: black,
    marginRight: wp('2%'),
  },
  solutionText: {
    fontSize: hp('1.8%'),
    color: black,
    flex: 1,
  },
});

export default DeviceInstructions;
