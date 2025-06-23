"use client"

import { toast as sonnerToast } from "sonner"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  action?: {
    label: string
    onClick: () => void
  }
}

function toast({ title, description, variant = "default", action }: ToastProps) {
  const message = title || description || ""
  const options: any = {}

  // Add description if both title and description are provided
  if (title && description) {
    options.description = description
  }

  // Add action if provided
  if (action) {
    options.action = {
      label: action.label,
      onClick: action.onClick,
    }
  }

  // Handle different variants
  if (variant === "destructive") {
    return sonnerToast.error(message, options)
  }

  return sonnerToast.success(message, options)
}

// Additional toast methods for convenience
toast.success = (message: string, options?: any) => sonnerToast.success(message, options)
toast.error = (message: string, options?: any) => sonnerToast.error(message, options)
toast.info = (message: string, options?: any) => sonnerToast.info(message, options)
toast.warning = (message: string, options?: any) => sonnerToast.warning(message, options)
toast.loading = (message: string, options?: any) => sonnerToast.loading(message, options)

function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}

export { useToast, toast }
