import type {
  VideInfo,
  VideInfoWithQuality,
  VideoInfoError
} from "~types/video-info.type"

export const isError = (
  value: VideInfoWithQuality | VideoInfoError | null | undefined
): value is VideoInfoError => {
  return value !== undefined && value !== null && "error" in value
}
