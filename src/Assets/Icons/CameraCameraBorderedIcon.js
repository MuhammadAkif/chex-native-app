import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CameraBorderedIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 6a3 3 0 013-3h14a3 3 0 013 3v12a3 3 0 01-3 3H5a3 3 0 01-3-3V6zm3-1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1H5zm11 2a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-7 5a3 3 0 116 0 3 3 0 01-6 0zm3-5a5 5 0 100 10 5 5 0 000-10z"
        fill={props?.color || "#1467B8"}
      />
    </Svg>
  )
}

export default CameraBorderedIcon
