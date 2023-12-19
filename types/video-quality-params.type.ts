import type { FileContainer } from "./video-info.type"

export interface QualityParams {
  itag: number
  qualityLabel: string
  container: FileContainer
}
