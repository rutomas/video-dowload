import type { PlasmoMessaging } from "@plasmohq/messaging"

import { VIDEO_DOWNLOAD_URL } from "~api/const/video-download-href"
import type { VideoLoadWithParamsDTO } from "~types/video-load.dto.type"

const loadVideoWithParams: PlasmoMessaging.MessageHandler<
  VideoLoadWithParamsDTO,
  null
> = async (reg, res) => {
  const {
    id,
    name,
    param: { itag, container, qualityLabel }
  } = reg.body

  const params = new URLSearchParams()

  params.set("id", id)
  params.set("name", name)
  params.set("itag", itag.toString())
  params.set("container", container)
  params.set("qualityLabel", qualityLabel)

  const url = `${VIDEO_DOWNLOAD_URL}/download-with-quality?${params}`

  await chrome.downloads.download({ url, saveAs: true, method: "GET" })

  return res.send(null)
}

export default loadVideoWithParams
