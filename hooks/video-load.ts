import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { ItemQuality } from "~types/item-quality.type"
import type {
  VideInfoWithQuality,
  VideoInfoError
} from "~types/video-info.type"
import type {
  VideoLoadDTO,
  VideoLoadWithParamsDTO
} from "~types/video-load.dto.type"
import { isError } from "~utils/is-error"

export const useVideoLoad = (tabId: number) => {
  const [video] = useStorage({
    key: `${tabId}`,
    instance: new Storage({
      area: "local"
    })
  })

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState(false)

  useEffect(() => {
    setIsLoading(false)
    setError(false)
  }, [video])

  const getVideoId = (): Promise<string | null> => {
    return sendToBackground({
      name: "videoId"
    })
  }

  const getVideoInfo = async (): Promise<
    VideInfoWithQuality | VideoInfoError
  > => {
    const storage = new Storage({ area: "local" })

    const videoId = await getVideoId()

    if (videoId === null) {
      return { error: "Video id not found" }
    }

    const video = await storage.get<
      VideInfoWithQuality | VideoInfoError | null | undefined
    >(`${tabId}`)

    if (
      video !== undefined &&
      video !== null &&
      !isError(video) &&
      video.videoDetails.videoId === videoId
    ) {
      return video
    }

    await storage.set(`${tabId}`, null)

    const info = await sendToBackground({
      name: "videoInfo",
      body: { videoId }
    })

    await storage.set(`${tabId}`, info)

    const data = await storage.get<VideInfoWithQuality | VideoInfoError>(
      `${tabId}`
    )

    return data
  }

  const videoLoad = async (body: VideoLoadDTO): Promise<null> => {
    return await sendToBackground({
      name: "videoLoad",
      body
    })
  }

  const videoLoadWithParams = async (
    body: VideoLoadWithParamsDTO
  ): Promise<null> => {
    return await sendToBackground({
      name: "videoLoadWithParams",
      body
    })
  }

  const onloadVideo = async (
    loadVideoFn: (videoInfo: VideInfoWithQuality) => Promise<void>
  ) => {
    setError(false)

    setIsLoading(true)

    const info = await getVideoInfo()

    if (isError(info)) {
      setError(true)

      setIsLoading(false)

      return
    }

    await loadVideoFn(info)

    setIsLoading(false)
  }

  const onloadVideoClick = () => {
    onloadVideo(async ({ videoDetails: { title, videoId } }) => {
      await videoLoad({ id: videoId, name: title })
    })
  }

  const onLoadVideoWithParams = ({
    itag,
    container,
    qualityLabel
  }: ItemQuality) => {
    onloadVideo(async ({ videoDetails: { title, videoId } }) => {
      await videoLoadWithParams({
        id: videoId,
        name: title,
        param: { itag, container, qualityLabel }
      })
    })
  }

  return {
    isLoading,
    error,
    getVideoId,
    getVideoInfo,
    onloadVideoClick,
    onLoadVideoWithParams
  }
}
