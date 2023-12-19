import type { QualityParams } from "./video-quality-params.type"

export interface VideoLoadDTO {
  readonly id: string
  readonly name: string
}

export interface VideoLoadWitchParamsDTO extends VideoLoadDTO {
  readonly param: QualityParams
}
