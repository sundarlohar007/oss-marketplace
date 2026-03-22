"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ToasterProps {}

export const Toaster: React.FC<ToasterProps> = () => {
  const [toasts, setToasts] = React.useState<Array<{
    id: string
    title?: string
    description?: string
    variant?: 'default' | 'destructive'
  }>>([])

  React.useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const toast = event.detail
      setToasts((prev) => [...prev, { ...toast, id: Math.random().toString(36).substr(2, 9) }])
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 5000)
    }

    window.addEventListener('toast' as any, handleToast)
    return () => window.removeEventListener('toast' as any, handleToast)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-4 p-4 rounded-lg border shadow-lg bg-background",
            toast.variant === 'destructive' && "border-destructive"
          )}
        >
          <div className="flex-1">
            {toast.title && <p className="font-medium">{toast.title}</p>}
            {toast.description && (
              <p className="text-sm text-muted-foreground">{toast.description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export function toast(options: {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}) {
  window.dispatchEvent(new CustomEvent('toast', { detail: options }))
}
