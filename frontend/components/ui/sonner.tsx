"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

export type ToastClassification =
  | "info"
  | "success"
  | "error"
  | "warning"

const Toaster = ({
  classification,
  title,
  description,
  ...props
}: {
  classification: ToastClassification
  title: string
  description: string
} & ToasterProps) => {
  const theme = useTheme()
  const isDark = theme.theme === "dark"

  return (
    <div
      className={cn(
        "toaster group p-4 rounded-md shadow-md border border-border",
        {
          "bg-destructive text-background": classification === "error",
          "bg-warning text-background": classification === "warning",
          "bg-success text-background": classification === "success",
          "bg-info text-foreground": classification === "info",
          "dark:border-input": isDark,
        }
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <div className="font-bold">{title}</div>
          <div className="text-sm">{description}</div>
        </div>
        <button
          type="button"
          className="text-foreground hover:text-destructive dark:hover:text-destructive/70 focus:outline-none focus:ring-2 focus:ring-destructive/50"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-4 h-4 fill-current"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 8 8"
          >
            <path d="M0 0L8 8M8 0L0 8" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export { Toaster }
