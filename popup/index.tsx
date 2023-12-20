import { useEffect, useMemo, useState } from "react"

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

const Select = ({ select }: { select: boolean }) => {
  return (
    <div is-select={select.toString()} className={indexModuleScss.select}></div>
  )
}

const LoadItem = ({
  items,
  isVideo,
  selectedItem,
  onSelect
}: {
  items: ItemQuality[]
  isVideo: boolean
  selectedItem: ItemQuality
  onSelect: (item: ItemQuality) => void
}) => {
  return items.map((item, index) => (
    <div
      onClick={() => onSelect(item)}
      className={indexModuleScss.fileContainer}
      key={index}>
      <span>{item.container}</span>

      <div className={indexModuleScss.info}>
        {isVideo && <span>video quality: {item.qualityLabel}</span>}
        <span>audio bitrate: {item.audioBitrate}</span>
      </div>

      <div className={indexModuleScss.imageContainer}>
        <Select select={selectedItem.itag === item.itag} />
      </div>
    </div>
  ))
}

const VideoDownload = ({ tabId }: { tabId: number }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadItem, setLoadItem] = useState<ItemQuality>()

  const [videoInfo] = useStorage<VideInfoWitchQuality | VideoInfoError | null>({
    key: `${tabId}`,
    instance: new Storage({ area: "session" })
  })

  const videoList = useMemo(() => {
    if (!videoInfo || isError(videoInfo)) {
      return null
    }

    return videoInfo.listOfVideoQuality.sort((a, b) => b.itag - a.itag)
  }, [videoInfo])

  useEffect(() => {
    if (videoList === null) {
      return
    }

    setLoadItem(videoList[0])
  }, [videoList])

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

          <LoadItem
            items={videoList}
            isVideo={true}
            selectedItem={loadItem}
            onSelect={onSelect}
          />

          <h3>Audio</h3>

          <LoadItem
            items={videoInfo.listOfAudioQuality}
            isVideo={false}
            selectedItem={loadItem}
            onSelect={onSelect}
          />
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
