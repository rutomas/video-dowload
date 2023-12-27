import downloadSvg from "data-base64:~assets/download.svg"
import errorSvg from "data-base64:~assets/exclamation-point.svg"

import { useVideoLoad } from "~hooks/video-load"

import { Loader } from "./Loader"

interface Props {
  tabId: number
}

export const BtnLoad = ({ tabId }: Props) => {
  const { isLoading, error, onloadVideoClick } = useVideoLoad(tabId)

  return isLoading ? (
    <div className="extension-video-download-wrapper">
      <div className="extension-video-download-loader-box">
        <Loader size={4} isLoading={true} />
      </div>
    </div>
  ) : error ? (
    <div className="extension-video-download-wrapper">
      <div className="extension-video-download-error">
        <img src={errorSvg} alt="error" />
      </div>
    </div>
  ) : (
    <button onClick={onloadVideoClick} className="extension-video-download-btn">
      <img width={30} height={30} src={downloadSvg} alt="Download" />
    </button>
  )
}
