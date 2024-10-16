import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {isNotEmpty} from './index';

export const headerFlex = {
  true: 1.5,
  false: 1,
};
export const headerFlexGrow = {
  true: 2,
  false: 1,
};
export const headerTextBottom = {
  true: hp('3%'),
  false: null,
};
export const imageHeight = {
  true: hp('20%'),
  false: hp('30%'),
};
export const instructionsContainerTop = {
  true: hp('25%'),
  false: null,
};
export const INSPECTION_STATUS = {
  true: 'No Damage Detected',
  false: 'Damage Detected',
};
export function formatTitle(title) {
  if (!isNotEmpty(title)) {
    return 'No Title';
  }
  return title
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
