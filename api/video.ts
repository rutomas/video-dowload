import type {
  VideInfoWitchQuality,
  VideoInfoError
} from "~types/video-info.type"

import { VIDEO_DOWNLOAD_URL } from "./const/video-download-href"

export class VideApi {
  static async getInfoWitchQuality(
    id: string
  ): Promise<VideInfoWitchQuality | VideoInfoError> {
    const headers = {
      "Content-Type": "application/json"
    }

    const params = new URLSearchParams()

    params.set("id", id)

    const response = await fetch(
      `${VIDEO_DOWNLOAD_URL}/info-with-quality?${params}`,
      {
        method: "GET",
        headers
      }
    )

    const parsedUrlData = await response.json()

    return parsedUrlData
  }
}
