'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SaveSuccessToast({ show, message }: { show: boolean; message: string }) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        router.refresh()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, router])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg bg-green-500/90 text-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
