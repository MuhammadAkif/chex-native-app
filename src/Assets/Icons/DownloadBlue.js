import * as React from "react"
import Svg, { Path } from "react-native-svg"

function DownloadBlue(props) {
  return (
    <Svg
      width={22}
      height={20}
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M11 13V1m0 12L7 9m4 4l4-4M1 15l.621 2.485A2 2 0 003.561 19h14.878a2 2 0 001.94-1.515L21 15"
        stroke="#1468BA"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default DownloadBlue
