import React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

function Damage_Vehicle({
  height = hp('3%'),
  width = wp('6%'),
  color = '#FB3131',
  style,
}) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      style={style}
      viewBox="0 0 19 19">
      <Rect width="18.587" height="18.587" fill={color} rx="6.97" />
      <G fill="#fff" clipPath="url(#clip0_3294_298)">
        <Path d="M16.001 8.396l-.997-.5a.422.422 0 01-.187-.185l-.94-1.88a1.339 1.339 0 00-1.2-.737h-1.64a.469.469 0 00-.445.32l-.437 1.31a.469.469 0 00.055.408l.7 1.05-.7 1.05a.467.467 0 00-.055.112l-.133.401-.167-.25.537-.786a.469.469 0 00-.011-.545l-.91-1.216.481-.482a.468.468 0 00-.051-.707l-.768-.572a.466.466 0 00-.28-.092h-1.2c-.507 0-.98.291-1.205.743l-.89 1.777a.392.392 0 01-.263.209l-2.444.611a1.337 1.337 0 00-1.015 1.302V11.5a1.3 1.3 0 001.298 1.298h.574a2.005 2.005 0 001.87 1.31c.851 0 1.598-.547 1.875-1.31h3.24a2.005 2.005 0 001.871 1.31c.851 0 1.598-.547 1.874-1.31h1.008a1.3 1.3 0 001.298-1.298V9.6c0-.513-.285-.975-.743-1.205zm-9.375 3.868a1.061 1.061 0 01-1.047.907 1.069 1.069 0 01-1.06-1.06c0-.584.475-1.06 1.06-1.06a1.061 1.061 0 011.047 1.213zm6.985 0a1.061 1.061 0 01-1.047.907 1.069 1.069 0 01-1.06-1.06 1.061 1.061 0 112.107.153zm2.196-.764c0 .2-.162.362-.361.362h-.903a1.998 1.998 0 00-1.979-1.747 1.998 1.998 0 00-1.979 1.747H7.558a1.998 1.998 0 00-1.98-1.747A1.998 1.998 0 003.6 11.862h-.466a.362.362 0 01-.361-.362V9.737c0-.187.124-.349.304-.393l2.443-.612c.38-.093.7-.348.875-.698l.89-1.777a.412.412 0 01.368-.226h1.045l.21.155-.386.385a.469.469 0 00-.044.612l.952 1.273-.527.771a.468.468 0 00-.003.524l.873 1.311c.1.149.276.236.452.204a.467.467 0 00.382-.316l.417-1.25.839-1.258a.468.468 0 000-.52l-.747-1.119.258-.772h1.304c.154 0 .294.086.363.221l.94 1.883c.133.257.34.463.6.597l1 .5c.137.07.226.215.226.37V11.5zM10.88 4.184a.468.468 0 00.607-.265l.44-1.124a.469.469 0 00-.872-.342l-.44 1.124a.468.468 0 00.265.607zM9.182 3.919a.468.468 0 10.872-.342l-.44-1.124a.468.468 0 10-.873.342l.44 1.124z" />
      </G>
      <Defs>
        <ClipPath id="clip0_3294_298">
          <Path
            fill="#fff"
            d="M0 0H16.263V16.263H0z"
            transform="translate(1.16)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default Damage_Vehicle;
