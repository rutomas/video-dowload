import { Storage } from "@plasmohq/storage"

import { VideApi } from "~api/video"
import type { VideInfo } from "~types/video-info.type"

// const inject = async (tabId: number) => {
//   await chrome.scripting.executeScript({
//     target: {
//       tabId
//     },
//     world: "MAIN",
//     func: YoutubeContent
//   })
// }

const storage = new Storage({ area: "session" })

chrome.tabs.onUpdated.addListener(
  async (tabId: number, changeInfo: any, tab: any) => {
    if (!tab.url) {
      return
    }

    const url = new URL(tab.url)

    if (
      url.host === "www.youtube.com" &&
      url.searchParams.has("v") &&
      changeInfo?.status === "complete"
    ) {
      const videoId = url.searchParams.get("v")

      await storage.set(`${tabId}`, null)

      const info = await VideApi.getInfo(videoId)

      void storage.set(`${tabId}`, info)
    }
  }
)
