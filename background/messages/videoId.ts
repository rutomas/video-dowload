import type { PlasmoMessaging } from "@plasmohq/messaging"

const videoId: PlasmoMessaging.MessageHandler<void, string | null> = async (
  _reg,
  res
) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  const url = new URL(tab.url)

  res.send(url.searchParams.get("v"))
}

export default videoId
