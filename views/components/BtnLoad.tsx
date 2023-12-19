import downloadSvg from "data-base64:~assets/download.svg"
import errorSvg from "data-base64:~assets/exclamation-point.svg"
import { useRef, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { VideApi } from "~api/video"
import type {
  VideInfoWitchQuality,
  VideoInfoError
} from "~types/video-info.type"
import type { VideoLoadDTO } from "~types/video-load.dto.type"
import { isError } from "~utils/is-error"

import { Loader } from "./Loader"
import { Ripple } from "./Ripple"

interface Props {
  tabId: number
}

const videoLoad = async (body: VideoLoadDTO): Promise<null> => {
  return await sendToBackground({
    name: "videoLoad",
    body
  })
}

export const BtnLoad = ({ tabId }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const ref = useRef(null)

  const [videoInfo] = useStorage<VideInfoWitchQuality | VideoInfoError | null>({
    key: `${tabId}`,
    instance: new Storage({ area: "session" })
  })

  const onloadClick = async () => {
    if (isError(videoInfo)) {
      return
    }

    setIsLoading(true)

    const {
      videoDetails: { title, videoId }
    } = videoInfo

    await videoLoad({ id: videoId, name: title })

    setIsLoading(false)
  }

  return !videoInfo || isLoading ? (
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
