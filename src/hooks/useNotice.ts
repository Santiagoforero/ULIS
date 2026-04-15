import { useCallback, useState } from 'react'

export type NoticeState =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | { type: 'info'; message: string }
  | null

export function useNotice() {
  const [notice, setNotice] = useState<NoticeState>(null)

  const showSuccess = useCallback((message: string) => {
    setNotice({ type: 'success', message })
  }, [])

  const showError = useCallback((message: string) => {
    setNotice({ type: 'error', message })
  }, [])

  const showInfo = useCallback((message: string) => {
    setNotice({ type: 'info', message })
  }, [])

  const clear = useCallback(() => setNotice(null), [])

  return { notice, showSuccess, showError, showInfo, clear }
}
