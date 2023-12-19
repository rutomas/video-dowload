import type { PlasmoMessaging } from "@plasmohq/messaging"

import { VIDEO_DOWNLOAD_URL } from "~api/const/video-download-href"
import type { VideoLoadDTO } from "~types/video-load.dto.type"

const videoLoad: PlasmoMessaging.MessageHandler<VideoLoadDTO, null> = async (
  reg,
  res
) => {
  const { id, name } = reg.body

  const params = new URLSearchParams()

  params.set("id", id)
  params.set("name", name)

  const url = `${VIDEO_DOWNLOAD_URL}/download?${params}`

  await chrome.downloads.download({ url, saveAs: true, method: "GET" })

  return res.send(null)
}

export default videoLoad
