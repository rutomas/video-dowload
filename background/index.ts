import iconActive from "data-base64:~assets/icon-active.png"
import iconDef from "data-base64:~assets/icon-def.png"

import { Storage } from "@plasmohq/storage"

import { setIcon } from "./utils/set-icon"

const storage = new Storage({ area: "local" })

chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: any, tab: any) => {
    if (!tab.url) {
      return
    }

    const url = new URL(tab.url)

    if (url.host === "www.youtube.com" && changeInfo?.status === "complete") {
      void setIcon(tabId, iconDef)

      void storage.set(`${tabId}`, null)

      if (url.searchParams.has("v")) {
        void setIcon(tabId, iconActive)
      }
    }
  }
)
