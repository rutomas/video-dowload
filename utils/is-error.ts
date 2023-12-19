import type { VideInfo, VideoInfoError } from "~types/video-info.type"

export const isError = (
  value: VideInfo | VideoInfoError | null | undefined
): value is VideoInfoError => {
  return value !== undefined && value !== null && "error" in value
}
