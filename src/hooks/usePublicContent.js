import { useEffect, useState } from 'react'
import { getContentApi } from '../api'

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function usePublicContent(section, fallback) {
  const [content, setContent] = useState(fallback)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    setContent(fallback)
    setStatus('loading')

    getContentApi(section)
      .then((response) => {
        if (cancelled) return
        const remote = isRecord(response?.data) ? response.data : {}
        setContent({ ...fallback, ...remote })
        setStatus(Object.keys(remote).length > 0 ? 'ready' : 'empty')
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable')
      })

    return () => {
      cancelled = true
    }
  }, [section, fallback])

  return { content, status }
}
