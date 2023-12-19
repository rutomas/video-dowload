import type { VideoThumbnail } from "./video-thumbnail.type"

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

export interface VideoInfoError {
  error: any
}
