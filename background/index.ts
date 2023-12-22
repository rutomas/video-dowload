import iconActive from "data-base64:~assets/icon-active.png"
import iconDef from "data-base64:~assets/icon-def.png"

import { Storage } from "@plasmohq/storage"

import { getVideoInfo } from "./utils/get-video-info"
import { setIcon } from "./utils/set-icon"

const storage = new Storage({ area: "session" })

chrome.tabs.onUpdated.addListener(
  async (tabId: number, changeInfo: any, tab: any) => {
    if (!tab.url) {
      return
    }

    const url = new URL(tab.url)

    if (url.host === "www.youtube.com" && changeInfo?.status === "complete") {
      await setIcon(tabId, iconDef)

      await storage.set(`${tabId}`, null)

      if (url.searchParams.has("v")) {
        const videoId = url.searchParams.get("v")

        const info = await getVideoInfo(videoId)

        if ("videoDetails" in info) {
          await setIcon(tabId, iconActive)
        }

        void storage.set(`${tabId}`, info)
      }
    }
  }
)
