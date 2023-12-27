import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getVideoInfo } from "~background/utils/get-video-info"
import type {
  VideInfoWithQuality,
  VideoInfoError
} from "~types/video-info.type"

const videoInfo: PlasmoMessaging.MessageHandler<
  { videoId: string },
  VideInfoWithQuality | VideoInfoError
> = async ({ body: { videoId } }, res) => {
  const info = await getVideoInfo(videoId)

  res.send(info)
}

export default videoInfo
