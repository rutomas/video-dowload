import { useEffect, useMemo, useState } from "react"

import { useVideoLoad } from "~hooks/video-load"
import type { ItemQuality } from "~types/item-quality.type"
import type { VideInfoWithQuality } from "~types/video-info.type"
import { isError } from "~utils/is-error"
import { Loader } from "~views/components/Loader"

import indexModuleScss from "./index.module.scss"

const getTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  return tab.id
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
  const { isLoading, error, getVideoInfo, onLoadVideoWithParams } =
    useVideoLoad(tabId)

  const [videoInfo, setVideoInfo] = useState<VideInfoWithQuality | null>(null)
  const [loadItem, setLoadItem] = useState<ItemQuality>()
  const [initialVideoData, setInitialVideoData] = useState(false)

  const videoList = useMemo(() => {
    if (videoInfo === null) {
      return null
    }

    return videoInfo.listOfVideoQuality.sort((a, b) => b.itag - a.itag)
  }, [videoInfo])

  useEffect(() => {
    setInitialVideoData(true)

    void getVideoInfo().then((info) => {
      if (isError(info)) {
        setInitialVideoData(false)

        return
      }

      setVideoInfo(info)

      setInitialVideoData(false)
    })
  }, [])

  useEffect(() => {
    if (videoList === null) {
      return
    }

    setLoadItem(videoList[0])
  }, [videoList])

  const onSelect = (value: ItemQuality) => {
    setLoadItem(value)
  }

  return error ? (
    <p className={indexModuleScss.title}>
      For some reason we can't load this video
    </p>
  ) : initialVideoData ? (
    <p className={indexModuleScss.title}> Loading video info ...</p>
  ) : videoInfo !== null ? (
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
        onClick={() => {
          onLoadVideoWithParams(loadItem)
        }}
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
  ) : (
    <p className={indexModuleScss.title}>Video not found</p>
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
