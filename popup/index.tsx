import checkSvg from "data-base64:~assets/check.svg"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { ItemQuality } from "~types/item-quality.type"
import type {
  VideInfoWitchQuality,
  VideoInfoError
} from "~types/video-info.type"
import type { VideoLoadWitchParamsDTO } from "~types/video-load.dto.type"
import { isError } from "~utils/is-error"
import { Loader } from "~views/components/Loader"

import indexModuleScss from "./index.module.scss"

interface VideoDownloadProps {
  tabId: number
}

const getTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  return tab.id
}

export const loadVideo = async (
  body: VideoLoadWitchParamsDTO
): Promise<null> => {
  return await sendToBackground({
    name: "videoLoadWitchParams",
    body
  })
}

const VideoDownload = ({ tabId }: VideoDownloadProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadItem, setLoadItem] = useState<ItemQuality>()

  const [videoInfo] = useStorage<VideInfoWitchQuality | VideoInfoError | null>({
    key: `${tabId}`,
    instance: new Storage({ area: "session" })
  })

  useEffect(() => {
    if (!videoInfo || isError(videoInfo)) {
      return
    }

    setLoadItem(videoInfo.listOfVideoQuality[0])
  }, [videoInfo])

  const onSelect = (value: ItemQuality) => {
    setLoadItem(value)
  }

  const onBtnDownloadClick = async () => {
    if (isError(videoInfo)) {
      return
    }

    setIsLoading(true)

    const {
      videoDetails: { videoId, title }
    } = videoInfo

    const { itag, container, qualityLabel } = loadItem

    await loadVideo({
      id: videoId,
      name: title,
      param: { itag, container, qualityLabel }
    })

    setIsLoading(false)
  }

  return !videoInfo ? (
    <p className={indexModuleScss.title}>Video not found</p>
  ) : isError(videoInfo) ? (
    <p className={indexModuleScss.title}>
      For some reason we can't load this video
    </p>
  ) : (
    <div className={indexModuleScss.videoDownload}>
      <div className={indexModuleScss.description}>
        <img
          width={90}
          height={50}
          src={videoInfo.videoDetails.thumbnails[0].url}
          alt="Thumbnails"
        />

        <span className={indexModuleScss.title}>
          {videoInfo.videoDetails.title}
        </span>
      </div>

      {loadItem && (
        <div className={indexModuleScss.loadOptions}>
          <h3>Video</h3>

          {videoInfo.listOfVideoQuality.map((item, index) => (
            <div
              onClick={() => onSelect(item)}
              className={indexModuleScss.fileContainer}
              key={index}>
              <span>{item.container}</span>

              <div className={indexModuleScss.info}>
                <span>video quality: {item.qualityLabel}</span>
                <span>audio bitrate: {item.audioBitrate}</span>
              </div>

              <div className={indexModuleScss.imageContainer}>
                {loadItem.itag === item.itag && (
                  <img width={20} height={20} src={checkSvg} alt="check" />
                )}
              </div>
            </div>
          ))}

          <h3>Audio</h3>

          {videoInfo.listOfAudioQuality.map((item, index) => (
            <div
              onClick={() => onSelect(item)}
              className={indexModuleScss.fileContainer}
              key={index}>
              <span>{item.container}</span>

              <div className={indexModuleScss.info}>
                <span>audio bitrate: {item.audioBitrate}</span>
              </div>

              <div className={indexModuleScss.imageContainer}>
                {loadItem.itag === item.itag && (
                  <img width={20} height={20} src={checkSvg} alt="check" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onBtnDownloadClick}
        className={indexModuleScss.btnDownload}>
        {isLoading ? (
          <div className={indexModuleScss.loaderContainer}>
            <Loader
              isLoading={true}
              size={4.5}
              className={indexModuleScss.loader}
            />
          </div>
        ) : (
          <span>Download</span>
        )}
      </button>
    </div>
  )
}

const IndexPopup = () => {
  const [tabId, setTabId] = useState<number | null>(null)

  useEffect(() => {
    getTabId().then((id) => {
      setTabId(id)
    })
  }, [])

  return tabId && <VideoDownload tabId={tabId} />
}

export default IndexPopup
