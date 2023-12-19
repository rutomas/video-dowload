import downloadSvg from "data-base64:~assets/download.svg"
import { useEffect, useMemo, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { VideApi } from "~api/video"
import type { VideInfo, VideoInfoError } from "~types/video-info.type"
import { isError } from "~utils/is-error"

import indexModuleScss from "./index.module.scss"

interface VideoDownloadProps {
  tabId: number
}

const getTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  return tab.id
}

const VideoDownload = ({ tabId }: VideoDownloadProps) => {
  const [videoInfo] = useStorage<VideInfo | VideoInfoError | null>({
    key: `${tabId}`,
    instance: new Storage({ area: "session" })
  })

  const error = useMemo(() => {
    return isError(videoInfo)
  }, [videoInfo])

  const onBtnDownloadClick = () => {
    if (isError(videoInfo)) {
      return
    }

    const {
      videoDetails: { title, videoId }
    } = videoInfo

    VideApi.downloadExternal(videoId, title)
  }

  return !videoInfo ? (
    <p className={indexModuleScss.title}>Video not found</p>
  ) : isError(videoInfo) ? (
    <p className={indexModuleScss.title}>
      For some reason we can't load this video
    </p>
  ) : (
    <div className={indexModuleScss.videoDownload}>
      <img
        width={90}
        height={50}
        src={videoInfo.videoDetails.thumbnails[0].url}
        alt="Thumbnails"
      />
      <span className={indexModuleScss.title}>
        {videoInfo.videoDetails.title}
      </span>

      <button
        onClick={onBtnDownloadClick}
        className={indexModuleScss.btnDownload}>
        <img width={30} height={30} src={downloadSvg} alt="Download" />
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
