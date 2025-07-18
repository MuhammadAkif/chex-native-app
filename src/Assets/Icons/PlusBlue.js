
import * as React from "react"
import Svg, { Path } from "react-native-svg"

function PlusBlue(props) {
  return (
    <Svg
      width={27}
      height={27}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M18 2.25H9A6.757 6.757 0 002.25 9v14.625a1.125 1.125 0 001.125 1.125H18A6.757 6.757 0 0024.75 18V9A6.757 6.757 0 0018 2.25zm1.125 12.375h-4.5v4.5h-2.25v-4.5h-4.5v-2.25h4.5v-4.5h2.25v4.5h4.5v2.25z"
        fill="#1468BA"
      />
    </Svg>
  )
}

export default PlusBlue
