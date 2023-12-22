export const setIcon = async (tabId: number, path: string) => {
  await chrome.action.setIcon({ tabId, path })
}
