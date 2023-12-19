import type { FileContainer } from "./video-info.type"

export interface ItemQuality {
  readonly quality: string
  readonly qualityLabel: string
  readonly videoCodec: string
  readonly fps: number
  readonly itag: number
  readonly bitrate: number
  readonly height: number
  readonly width: number
  readonly audioBitrate: number
  readonly container: FileContainer
}
