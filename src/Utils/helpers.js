import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
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

export const customSortOrder = {
  groupType: [
    'carVerificiationItems',
    'interiorItems',
    'exteriorItems',
    'tires',
  ],
  carVerificiationItems: ['license_plate_number', 'odometer'],
  interiorItems: [
    'interior_passenger_side',
    'interior_passenger_side0',
    'interior_passenger_side1',
    'interior_passenger_side2',
    'interior_driver_side',
    'interior_driver_side0',
    'interior_driver_side1',
    'interior_driver_side2',
  ],
  exteriorItems: [
    'exterior_front',
    'exterior_front0',
    'exterior_front1',
    'exterior_front2',
    'exterior_rear',
    'exterior_rear0',
    'exterior_rear1',
    'exterior_rear2',
    'front_left_corner',
    'front_left_corner0',
    'front_left_corner1',
    'front_left_corner2',
    'front_right_corner',
    'front_right_corner0',
    'front_right_corner1',
    'front_right_corner2',
    'rear_left_corner',
    'rear_left_corner0',
    'rear_left_corner1',
    'rear_left_corner2',
    'rear_right_corner',
    'rear_right_corner0',
    'rear_right_corner1',
    'rear_right_corner2',
    'inside_cargo_roof',
    'inside_cargo_roof0',
    'inside_cargo_roof1',
    'inside_cargo_roof2',
  ],
  tires: [
    'left_front_tire',
    'left_rear_tire',
    'right_front_tire',
    'right_rear_tire',
  ],
};

export const styleMapping = {
  exterior_left: {height: hp('25%')},
  exterior_right: {height: hp('25%')},
  exterior_front: {height: hp('50%')},
  exterior_rear: {height: hp('50%')},
  front_left_corner: {height: hp('30%')},
  front_right_corner: {height: hp('30%')},
  rear_left_corner: {height: hp('30%')},
  rear_right_corner: {height: hp('30%')},
};
