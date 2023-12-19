import cssText from "data-text:~/contents/youtube-content.scss"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { BtnLoad } from "~views/components/BtnLoad"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"],
  all_frames: false
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(".ytp-time-display")

// Use this to optimize unmount lookups
export const getShadowHostId = () => "plasmo-inline-example-unique-id"

const getTabId = async (): Promise<number> => {
  return await sendToBackground({
    name: "tabId"
  })
}

const YoutubeContent = () => {
  const [tabId, setTabId] = useState<number | null>(null)

  useEffect(() => {
    getTabId().then((id) => {
      setTabId(id)
    })
  }, [])

  return tabId !== null && <BtnLoad tabId={tabId} />
}

export default YoutubeContent
