import type { VideInfo, VideoInfoError } from "~types/video-info.type"

import { VIDEO_DOWNLOAD_URL } from "./const/video-download-href"

export class VideApi {
  static async getInfo(id: string): Promise<VideInfo | VideoInfoError> {
    const headers = {
      "Content-Type": "application/json"
    }

    const params = new URLSearchParams()

    params.set("id", id)

    const response = await fetch(`${VIDEO_DOWNLOAD_URL}/info?${params}`, {
      method: "GET",
      headers
    })

    const parsedUrlData = await response.json()

    return parsedUrlData
  }

  static async download(id: string, name: string): Promise<void> {
    const headers = {
      "Content-Type": "application/json"
    }

    const params = new URLSearchParams()

    params.set("id", id)
    params.set("name", name)

    const response = await fetch(`${VIDEO_DOWNLOAD_URL}/download?${params}`, {
      method: "GET",
      headers
    })

    const parsedUrlData = await response.json()

    return parsedUrlData
  }

  static downloadExternal(id: string, name: string): void {
    const params = new URLSearchParams()

    params.set("id", id)
    params.set("name", name)

    window.location.href = `${VIDEO_DOWNLOAD_URL}/download?${params}`
  }
}
