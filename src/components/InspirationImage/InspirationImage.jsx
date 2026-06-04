import { useState } from 'react'
import { INSPIRATION_FALLBACK } from '../../data/inspirations'

export default function InspirationImage({
  src,
  alt,
  className,
  loading,
  fetchPriority,
}) {
  const [current, setCurrent] = useState(src)

  return (
    <img
      className={className}
      src={current}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={() => {
        if (current !== INSPIRATION_FALLBACK) {
          setCurrent(INSPIRATION_FALLBACK)
        }
      }}
    />
  )
}
