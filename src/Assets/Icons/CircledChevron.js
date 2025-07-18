import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function CircledChevron(props) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={23.338}
        y={24}
        width={22.338}
        height={22.4828}
        rx={11.169}
        transform="rotate(180 23.338 24)"
        stroke="#B8BFD2"
        strokeWidth={2}
      />
      <Path
        d="M17.267 15.896l.733-.779-6.226-6.623-6.226 6.623.732.78 5.494-5.844 5.493 5.843z"
        fill="#B8BFD2"
      />
    </Svg>
  )
}

export default CircledChevron
