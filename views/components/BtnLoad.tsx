import downloadSvg from "data-base64:~assets/download.svg"
import errorSvg from "data-base64:~assets/exclamation-point.svg"
import { useRef } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { VideApi } from "~api/video"
import type { VideInfo, VideoInfoError } from "~types/video-info.type"
import { isError } from "~utils/is-error"

import { Loader } from "./Loader"
import { Ripple } from "./Ripple"

interface Props {
  tabId: number
}

export const BtnLoad = ({ tabId }: Props) => {
  const ref = useRef(null)

  const [videoInfo] = useStorage<VideInfo | VideoInfoError | null>({
    key: `${tabId}`,
    instance: new Storage({ area: "session" })
  })

  const onloadClick = () => {
    if (isError(videoInfo)) {
      return
    }

    const {
      videoDetails: { title, videoId }
    } = videoInfo

    VideApi.downloadExternal(videoId, title)
  }

  return !videoInfo ? (
    <div className="extension-video-download-wrapper">
      <div className="extension-video-download-loader-box">
        <Loader size={4} isLoading={true} />
      </div>
    </div>
  ) : isError(videoInfo) ? (
    <div className="extension-video-download-wrapper">
      <div className="extension-video-download-error">
        <img src={errorSvg} alt="error" />
      </div>
    </div>
  ) : (
    <button
      ref={ref}
      onClick={onloadClick}
      className="extension-video-download-btn">
      <img width={30} height={30} src={downloadSvg} alt="Download" />
      <Ripple host={ref} />
    </button>
  )
}
