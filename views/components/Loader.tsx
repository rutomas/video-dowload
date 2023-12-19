interface Props {
  isLoading: boolean
  size?: number
}

export const Loader = ({ isLoading, size = 16 }: Props) => {
  return (
    isLoading && (
      <div
        style={{
          fontSize: `${size}px`
        }}
        className="extension-video-download-loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  )
}
