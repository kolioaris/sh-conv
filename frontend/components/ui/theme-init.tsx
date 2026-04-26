"use client"
import { useEffect } from "react"
import { useTheme } from "next-themes"
import { applyColorTheme } from "@/hooks/useColorTheme"
import { applyCustomCss } from "@/hooks/useCustomCss"

export function ThemeInit() {
  const { setTheme } = useTheme()

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        const base = data.api_base || "http://localhost:8000"
        return fetch(`${base}/settings`)
      })
      .then((res) => res.json())
      .then((data) => {
        const isDark = data.darkmode ?? true
        const color = data.colorTheme ?? "Default"
        setTheme(isDark ? "dark" : "light")
        applyColorTheme(color, isDark)

        if (data.customCss) {
          applyCustomCss(data.customCss)
        }
      })
      .catch(console.error)
  }, [setTheme])

  return null
}
