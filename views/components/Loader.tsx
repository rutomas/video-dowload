interface Props {
  isLoading: boolean
  className?: string
  size?: number
}

export const Loader = ({ isLoading, size = 16, className }: Props) => {
  return (
    isLoading && (
      <div
        style={{
          fontSize: `${size}px`
        }}
        className={`${
          className ? className : "extension-video-download-loader"
        }`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  )
}
