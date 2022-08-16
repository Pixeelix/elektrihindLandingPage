export function Logomark(props) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 40C8.954 40 0 31.046 0 20S8.954 0 20 0s20 8.954 20 20-8.954 20-20 20ZM4 20c0 7.264 5.163 13.321 12.02 14.704C17.642 35.03 19 33.657 19 32V8c0-1.657-1.357-3.031-2.98-2.704C9.162 6.68 4 12.736 4 20Z"
      />
    </svg>
  )
}

export function Logo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 50 50"
    >
      <defs>
        <linearGradient
          id="linearGradient-1"
          x1="50%"
          x2="50%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#6386FF"></stop>
          <stop offset="48.459%" stopColor="#1924CD"></stop>
          <stop offset="100%" stopColor="#6386FF"></stop>
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <rect
          width="50"
          height="50"
          x="0"
          y="0"
          fill="url(#linearGradient-1)"
          rx="10"
        ></rect>
        <g fill="#FFF" transform="translate(15.234 7.91)">
          <g>
            <path
              fillOpacity="0.75"
              d="M15.4296875 0L0 19.6289063 8.18260051 19.6289063z"
            ></path>
            <path
              fillOpacity="0.45"
              d="M0 19.6289062L15.4296875 0 4.06593117 19.6289062z"
            ></path>
          </g>
          <g transform="rotate(180 9.766 17.139)">
            <path
              fillOpacity="0.75"
              d="M15.4296875 0L0 19.6289063 8.18260051 19.6289063z"
            ></path>
            <path
              fillOpacity="0.45"
              d="M0 19.6289062L15.4296875 0 4.06593117 19.6289062z"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  )
}
