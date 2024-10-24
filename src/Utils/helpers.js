import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {isNotEmpty} from './index';
import {Landscape, Portrait} from '../Assets/Icons';

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

export function formatTitle(title = 'No Title') {
  if (!isNotEmpty(title)) {
    return 'No title';
  }
  // Split title by underscores and capitalize each word
  return title
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const extractStatusesCount = (list = []) => {
  if (list.length < 1) {
    return 'No status counts';
  }
  let counts = {reviewed: 0, in_review: 0, ready_for_review: 0};

  for (let i = 0; i < list.length; i++) {
    const status = list[i].status.toLowerCase();
    counts[status] += 1;
  }
  return counts;
};
export const styleMapping = {
  portrait: {
    exterior_left: {height: hp('25%')},
    exterior_right: {height: hp('25%')},
    exterior_front: {height: hp('50%')},
    exterior_rear: {height: hp('50%')},
    front_left_corner: {height: hp('30%')},
    front_right_corner: {height: hp('30%')},
    rear_left_corner: {height: hp('30%')},
    rear_right_corner: {height: hp('30%')},
  },
  landscape: {
    exterior_left: {width: wp('100%')},
    exterior_right: {width: wp('100%')},
    exterior_front: {width: wp('60%')},
    exterior_rear: {width: wp('60%')},
    front_left_corner: {width: wp('80%')},
    front_right_corner: {width: wp('80%')},
    rear_left_corner: {width: wp('80%')},
    rear_right_corner: {width: wp('80%')},
  },
};

export const switchFrameIcon = {
  portrait: Landscape,
  landscape: Portrait,
};
export const switchOrientation = {
  portrait: 'landscape',
  landscape: 'portrait',
};
