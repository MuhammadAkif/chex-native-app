import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ClockIcon(props) {
  return (
    <Svg
      width={11}
      height={10}
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M1 5a4.5 4.5 0 109 0 4.5 4.5 0 00-9 0z"
        stroke="#6E727C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.5 2.5V5L7 6.5"
        stroke="#6E727C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default ClockIcon
