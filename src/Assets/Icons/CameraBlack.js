import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CameraBlack(props) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M25.313 7.617h-3.985l-.95-2.66a.94.94 0 00-.884-.621h-8.988a.936.936 0 00-.882.621l-.952 2.66H4.687a2.343 2.343 0 00-2.343 2.344v13.36a2.343 2.343 0 002.344 2.343h20.625a2.343 2.343 0 002.343-2.344V9.96a2.343 2.343 0 00-2.343-2.343zM15 20.977a4.686 4.686 0 01-4.688-4.688A4.686 4.686 0 0115 11.602a4.686 4.686 0 014.688 4.687A4.686 4.686 0 0115 20.977zm-2.813-4.688a2.812 2.812 0 105.625 0 2.812 2.812 0 00-5.625 0z"
        fill="#414B55"
      />
    </Svg>
  )
}

export default CameraBlack
