import type { ItemQuality } from "./item-quality.type"
import type { VideoThumbnail } from "./video-thumbnail.type"

export interface VideoInfoError {
  error: any
}

export type FileContainer = "webm" | "mp4"

export interface VideInfo {
  readonly videoDetails: {
    readonly videoId: string
    readonly title: string
    readonly video_url: string
    readonly thumbnails: VideoThumbnail[]
  }
  readonly response: unknown
  readonly formats: unknown
  readonly html5player: string
  readonly page: string
  readonly player_response: unknown
  readonly related_videos: unknown
  readonly full: boolean
}

export interface VideInfoWithQuality extends VideInfo {
  readonly listOfVideoQuality: ItemQuality[]
  readonly listOfAudioQuality: ItemQuality[]
}
