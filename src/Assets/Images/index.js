export const IMAGES = {
  license_Plate: require('./license_number.jpg'),
  odometer: require('./Odometer.png'),
  exterior_Left: require('./ExteriorLeft.png'),
  exterior_Right: require('./ExteriorRight.png'),
  exterior_Front: require('./Exterior_Front.png'),
  exterior_Rear: require('./Exterior_Rear.png'),
  front_Left_Corner: require('./Front_Left_Corner.png'),
  front_Right_Corner: require('./Front_Right_Corner.png'),
  rear_Left_Corner: require('./Rear_Left_Corner.png'),
  rear_Right_Corner: require('./Rear_Right_Corner.png'),
  inside_Cargo_Roof: require('./Inside_Cargo_Roof.png'),
  interior_driver_side: require('./InteriorDriverside.jpg'),
  interior_passenger_side: require('./InteriorPassengerSide.png'),
  tire: require('./Tires.jpeg'),
  splash: require('./chexDSPSlpash-speed55s-no-repeat.gif'),
  sign_In_Background: require('./SignInBackgroundImage.jpeg'),
  completed_Inspection_Background: require('./CompletedInspection.jpg'),
  intro_Background: require('./IntroVehicle.png'),
  expiry_Inspection: require('./ExpiryInspection.png'),
  drawer: require('./DrawerImage.png'),
};

const portraitImages = {
  van: {
    exterior_left: require('./Portrait/van/Left_side.png'),
    exterior_right: require('./Portrait/van/Right_side.png'),
    exterior_front: require('./Portrait/van/Front.png'),
    exterior_rear: require('./Portrait/van/Back.png'),
    front_left_corner: require('./Portrait/van/Left_front.png'),
    front_right_corner: require('./Portrait/van/Right_front.png'),
    rear_left_corner: require('./Portrait/van/Left_back.png'),
    rear_right_corner: require('./Portrait/van/Right_back.png'),
  },
  truck: {
    exterior_left: require('./Portrait/truck/Left_side.png'),
    exterior_right: require('./Portrait/truck/Right_side.png'),
    exterior_front: require('./Portrait/truck/Front.png'),
    exterior_rear: require('./Portrait/truck/Back.png'),
    front_left_corner: require('./Portrait/truck/Left_front.png'),
    front_right_corner: require('./Portrait/truck/Right_front.png'),
    rear_left_corner: require('./Portrait/truck/Left_back.png'),
    rear_right_corner: require('./Portrait/truck/Right_back.png'),
  },
};

const landscapeImages = {
  van: {
    exterior_left: require('./Landscape/van/Left_side.png'),
    exterior_right: require('./Landscape/van/Right_side.png'),
    exterior_front: require('./Landscape/van/Front.png'),
    exterior_rear: require('./Landscape/van/Back.png'),
    front_left_corner: require('./Landscape/van/Left_front.png'),
    front_right_corner: require('./Landscape/van/Right_front.png'),
    rear_left_corner: require('./Landscape/van/Left_back.png'),
    rear_right_corner: require('./Landscape/van/Right_back.png'),
  },
  truck: {
    exterior_left: require('./Landscape/truck/Left_side.png'),
    exterior_right: require('./Landscape/truck/Right_side.png'),
    exterior_front: require('./Landscape/truck/Front.png'),
    exterior_rear: require('./Landscape/truck/Back.png'),
    front_left_corner: require('./Landscape/truck/Left_front.png'),
    front_right_corner: require('./Landscape/truck/Right_front.png'),
    rear_left_corner: require('./Landscape/truck/Left_back.png'),
    rear_right_corner: require('./Landscape/truck/Right_back.png'),
  },
};

export const getVehicleImages = (vehicleType = 'van') => ({
  portrait: portraitImages[vehicleType],
  landscape: landscapeImages[vehicleType],
});
