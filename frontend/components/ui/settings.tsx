"use client"
import { X, ChevronsUpDown, RefreshCw } from "lucide-react"
import { applyColorTheme, useColorTheme } from "@/hooks/useColorTheme"
import React, { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "next-themes"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { Slider } from "./slider"
import { Separator } from "./separator"
import { Switch } from "./switch"
import Editor from "@monaco-editor/react"
import { applyCustomCss } from "@/hooks/useCustomCss"
import { registerShadcnExtension } from "@/hooks/useMonacoExtension"

interface Stats {
  nextServer: { ram_mb: string; cpu_cores: number; load_avg: string } | null
  backend: { ram_mb: number; cpu_percent: number } | null
  system: {
    cpu_percent: number
    available_ram_mb: number
    total_ram_mb: number
  } | null
}

interface Props {
  open: boolean
  onClose: () => void
}

const TABS = ["General", "Appearance", "About"]
const COLOR_THEMES = [
  "Default",
  "Amber",
  "Blue",
  "Cyan",
  "Emerald",
  "Fuchsia",
  "Green",
  "Indigo",
  "Lime",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "Rose",
  "Sky",
  "Teal",
  "Violet",
  "Yellow",
]

const IMAGE_FORMATS = [
  "png",
  "jpg",
  "webp",
  "avif",
  "tiff",
  "bmp",
  "ico",
  "jp2",
  "psd",
]
const VIDEO_FORMATS = [
  "mp4",
  "mkv",
  "avi",
  "mov",
  "webm",
  "flv",
  "m4v",
  "ogv",
  "mpg",
  "mpeg",
]
const AUDIO_FORMATS = [
  "mp3",
  "aac",
  "flac",
  "opus",
  "wav",
  "ogg",
  "m4a",
  "aiff",
]

interface GeneralSettings {
  defaultImageFormat: string
  defaultVideoFormat: string
  defaultAudioFormat: string
  defaultImageQuality: number
  defaultImageScale: number
  defaultVideoCrf: number
  defaultVideoResolution: string
  defaultVideoFps: string
  defaultAudioBitrate: string
  defaultAudioSampleRate: number
  defaultAudioChannels: number
  defaultDownloadFormat: string
  defaultDownloadQuality: string
  defaultDownloadEmbedThumbnail: boolean
  defaultDownloadEmbedMetadata: boolean
  defaultDownloadAudioSampleRate: number
  defaultDownloadAudioChannels: number
}

const DEFAULT_GENERAL: GeneralSettings = {
  defaultImageFormat: "png",
  defaultVideoFormat: "mp4",
  defaultAudioFormat: "mp3",
  defaultImageQuality: 90,
  defaultImageScale: 1.0,
  defaultVideoCrf: 23,
  defaultVideoResolution: "",
  defaultVideoFps: "",
  defaultAudioBitrate: "192k",
  defaultAudioSampleRate: 44100,
  defaultAudioChannels: 2,
  defaultDownloadFormat: "mp4",
  defaultDownloadQuality: "best",
  defaultDownloadEmbedThumbnail: false,
  defaultDownloadEmbedMetadata: false,
  defaultDownloadAudioSampleRate: 44100,
  defaultDownloadAudioChannels: 2,
}

export function SettingsPopup({ open, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(false)
  const [activeTab, setActiveTab] = useState("General")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { setTheme, resolvedTheme } = useTheme()
  const [darkMode, setDarkMode] = useState(false)
  const [colorTheme, setColorTheme] = useState("Default")
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [general, setGeneral] = useState<GeneralSettings>(DEFAULT_GENERAL)
  const [generalSaving, setGeneralSaving] = useState(false)
  const [customCss, setCustomCss] = useState("")
  const [cssSaving, setCssSaving] = useState(false)
  const [apiBase, setApiBase] = useState("http://localhost:8000")

  useColorTheme(colorTheme, darkMode)

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const [pythonRes, nextRes] = await Promise.all([
        fetch("http://localhost:8000/stats")
          .then((r) => r.json())
          .catch(() => null),
        fetch("/api/stats")
          .then((r) => r.json())
          .catch(() => null),
      ])
      setStats({
        backend: pythonRes?.backend ?? null,
        system: pythonRes?.system ?? null,
        nextServer: nextRes,
      })
    } catch (err) {
      console.error("Diagnostics failed:", err)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      fetch("http://localhost:8000/settings")
        .then((r) => r.json())
        .then((data) => {
          setCustomCss(data.customCss ?? "")
          setDarkMode(data.darkmode ?? false)
          setColorTheme(data.colorTheme ?? "Default")
          setGeneral({
            defaultImageFormat: data.defaultImageFormat ?? "png",
            defaultVideoFormat: data.defaultVideoFormat ?? "mp4",
            defaultAudioFormat: data.defaultAudioFormat ?? "mp3",
            defaultImageQuality: data.defaultImageQuality ?? 90,
            defaultImageScale: data.defaultImageScale ?? 1.0,
            defaultVideoCrf: data.defaultVideoCrf ?? 23,
            defaultVideoResolution: data.defaultVideoResolution ?? "",
            defaultVideoFps: data.defaultVideoFps ?? "",
            defaultAudioBitrate: data.defaultAudioBitrate ?? "192k",
            defaultAudioSampleRate: data.defaultAudioSampleRate ?? 44100,
            defaultAudioChannels: data.defaultAudioChannels ?? 2,
            defaultDownloadFormat: data.defaultDownloadFormat ?? "mp4",
            defaultDownloadQuality: data.defaultDownloadQuality ?? "best",
            defaultDownloadEmbedThumbnail:
              data.defaultDownloadEmbedThumbnail ?? false,
            defaultDownloadEmbedMetadata:
              data.defaultDownloadEmbedMetadata ?? false,
            defaultDownloadAudioSampleRate:
              data.defaultDownloadAudioSampleRate ?? 44100,
            defaultDownloadAudioChannels:
              data.defaultDownloadAudioChannels ?? 2,
          })
        })
        .catch(console.error)
    }
  }, [open])

  useEffect(() => {
    if (activeTab === "About") fetchStats()
  }, [activeTab, fetchStats])

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.api_base) setApiBase(data.api_base)
      })
      .catch(() => {})
  }, [])

  async function handleDarkMode(enabled: boolean) {
    setDarkMode(enabled)
    setTheme(enabled ? "dark" : "light")
    applyColorTheme(colorTheme, enabled)
    await fetch("http://localhost:8000/darkmode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    })
  }

  async function handleColorTheme(theme: string) {
    setColorTheme(theme)
    applyColorTheme(theme, darkMode)
    await fetch("http://localhost:8000/colortheme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    })
  }

  async function saveGeneral() {
    setGeneralSaving(true)
    await fetch("http://localhost:8000/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(general),
    })
    setGeneralSaving(false)
  }

  async function saveCustomCss() {
    setCssSaving(true)
    applyCustomCss(customCss)
    await fetch(`${apiBase}/customcss`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ css: customCss }),
    })
    setCssSaving(false)
  }

  function setG<K extends keyof GeneralSettings>(
    key: K,
    value: GeneralSettings[K]
  ) {
    setGeneral((prev) => ({ ...prev, [key]: value }))
  }

  if (open) {
    if (!show) setShow(true)
  }

  useEffect(() => {
    if (open) {
      setShow(true)
      timerRef.current = setTimeout(() => setVisible(true), 10)
    } else {
      setVisible(false)
      timerRef.current = setTimeout(() => setShow(false), 200)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [open])

  if (!show) return null

  return (
    <div
      onClick={onClose}
      className={`sh-conv-settings-modal fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex h-5/6 w-11/12 max-w-3xl flex-col overflow-hidden rounded-lg border bg-background transition-all duration-200 md:flex-row ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        {/* Close Button */}
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-50 flex items-center justify-end p-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="pointer-events-auto h-10 w-10"
            size="icon"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar */}
        <div className="sh-conv-settings-sidebar flex flex-row overflow-x-auto border-b pt-2 md:w-48 md:flex-col md:overflow-x-visible md:border-r md:border-b-0 md:pt-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sh-conv-settings-tab px-4 py-3 text-left text-sm transition-colors hover:bg-muted md:w-full ${activeTab === tab ? "bg-muted font-medium" : "text-muted-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-12 md:pt-6">
          {/* General */}
          {activeTab === "General" && (
            <div className="sh-conv-settings-content space-y-6">
              <h2 className="text-lg font-semibold">General</h2>
              <Separator />

              {/* Default Formats */}
              <div>
                <h3 className="sh-conv-settings-section-title mb-3 text-sm font-medium">
                  Default Formats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <label>Image Format</label>
                    <Select
                      value={general.defaultImageFormat}
                      onValueChange={(v) => setG("defaultImageFormat", v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_FORMATS.map((f) => (
                          <SelectItem key={f} value={f}>
                            .{f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>Video Format</label>
                    <Select
                      value={general.defaultVideoFormat}
                      onValueChange={(v) => setG("defaultVideoFormat", v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VIDEO_FORMATS.map((f) => (
                          <SelectItem key={f} value={f}>
                            .{f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>Audio Format</label>
                    <Select
                      value={general.defaultAudioFormat}
                      onValueChange={(v) => setG("defaultAudioFormat", v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AUDIO_FORMATS.map((f) => (
                          <SelectItem key={f} value={f}>
                            .{f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Image Defaults */}
              <div>
                <h3 className="sh-conv-settings-section-title mb-3 text-sm font-medium">
                  Image Defaults
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>Quality</label>
                      <span className="text-muted-foreground">
                        {general.defaultImageQuality}
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      value={[general.defaultImageQuality]}
                      onValueChange={([v]) => setG("defaultImageQuality", v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>Scale</label>
                      <span className="text-muted-foreground">
                        {general.defaultImageScale}x
                      </span>
                    </div>
                    <Slider
                      min={0.1}
                      max={4}
                      step={0.1}
                      value={[general.defaultImageScale]}
                      onValueChange={([v]) => setG("defaultImageScale", v)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Video Defaults */}
              <div>
                <h3 className="sh-conv-settings-section-title mb-3 text-sm font-medium">
                  Video Defaults
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <label>Quality (CRF) — lower is better</label>
                      <span className="text-muted-foreground">
                        {general.defaultVideoCrf}
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={51}
                      step={1}
                      value={[general.defaultVideoCrf]}
                      onValueChange={([v]) => setG("defaultVideoCrf", v)}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>Resolution</label>
                    <Select
                      value={general.defaultVideoResolution || "original"}
                      onValueChange={(v) =>
                        setG(
                          "defaultVideoResolution",
                          v === "original" ? "" : v
                        )
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original</SelectItem>
                        <SelectItem value="1920:1080">1080p</SelectItem>
                        <SelectItem value="1280:720">720p</SelectItem>
                        <SelectItem value="854:480">480p</SelectItem>
                        <SelectItem value="640:360">360p</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>FPS</label>
                    <Select
                      value={general.defaultVideoFps || "original"}
                      onValueChange={(v) =>
                        setG("defaultVideoFps", v === "original" ? "" : v)
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">Original</SelectItem>
                        <SelectItem value="60">60</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Audio Defaults */}
              <div>
                <h3 className="sh-conv-settings-section-title mb-3 text-sm font-medium">
                  Audio Defaults
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <label>Bitrate</label>
                    <Select
                      value={general.defaultAudioBitrate}
                      onValueChange={(v) => setG("defaultAudioBitrate", v)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="320k">320k</SelectItem>
                        <SelectItem value="192k">192k</SelectItem>
                        <SelectItem value="128k">128k</SelectItem>
                        <SelectItem value="96k">96k</SelectItem>
                        <SelectItem value="64k">64k</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>Sample Rate</label>
                    <Select
                      value={String(general.defaultAudioSampleRate)}
                      onValueChange={(v) =>
                        setG("defaultAudioSampleRate", Number(v))
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="48000">48000 Hz</SelectItem>
                        <SelectItem value="44100">44100 Hz</SelectItem>
                        <SelectItem value="22050">22050 Hz</SelectItem>
                        <SelectItem value="16000">16000 Hz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>Channels</label>
                    <Select
                      value={String(general.defaultAudioChannels)}
                      onValueChange={(v) =>
                        setG("defaultAudioChannels", Number(v))
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Stereo</SelectItem>
                        <SelectItem value="1">Mono</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Download Defaults */}
              <div>
                <h3 className="sh-conv-settings-section-title mb-3 text-sm font-medium">
                  Download Defaults
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <label>Format</label>
                    <Select
                      value={general.defaultDownloadFormat}
                      onValueChange={(v) => setG("defaultDownloadFormat", v)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp4">MP4 (Video)</SelectItem>
                        <SelectItem value="mp3">MP3 (Audio)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>Video Quality</label>
                    <Select
                      value={general.defaultDownloadQuality}
                      onValueChange={(v) => setG("defaultDownloadQuality", v)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="best">Best</SelectItem>
                        <SelectItem value="1080">1080p</SelectItem>
                        <SelectItem value="720">720p</SelectItem>
                        <SelectItem value="480">480p</SelectItem>
                        <SelectItem value="360">360p</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>Audio Sample Rate</label>
                    <Select
                      value={String(general.defaultDownloadAudioSampleRate)}
                      onValueChange={(v) =>
                        setG("defaultDownloadAudioSampleRate", Number(v))
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="48000">48000 Hz</SelectItem>
                        <SelectItem value="44100">44100 Hz</SelectItem>
                        <SelectItem value="22050">22050 Hz</SelectItem>
                        <SelectItem value="16000">16000 Hz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>Audio Channels</label>
                    <Select
                      value={String(general.defaultDownloadAudioChannels)}
                      onValueChange={(v) =>
                        setG("defaultDownloadAudioChannels", Number(v))
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Stereo</SelectItem>
                        <SelectItem value="1">Mono</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>Embed Thumbnail</label>
                    <Switch
                      checked={general.defaultDownloadEmbedThumbnail}
                      onCheckedChange={(v) =>
                        setG("defaultDownloadEmbedThumbnail", v)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label>Embed Metadata</label>
                    <Switch
                      checked={general.defaultDownloadEmbedMetadata}
                      onCheckedChange={(v) =>
                        setG("defaultDownloadEmbedMetadata", v)
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <Button
                onClick={saveGeneral}
                disabled={generalSaving}
                className="sh-conv-settings-save-btn w-full hover:cursor-pointer"
              >
                {generalSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}

          {activeTab === "Appearance" && (
            <div className="sh-conv-settings-content space-y-4">
              <h2 className="text-lg font-semibold">Appearance</h2>
              <Separator />
              <div className="flex items-center justify-between">
                <label className="text-sm">Theme</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {darkMode ? "Dark" : "Light"}{" "}
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => handleDarkMode(true)}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDarkMode(false)}>
                        Light
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Color Theme</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {colorTheme} <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-64 overflow-y-auto">
                    <DropdownMenuGroup>
                      {COLOR_THEMES.map((theme, i) => (
                        <React.Fragment key={theme}>
                          {i === 1 && <Separator className="my-2" />}
                          <DropdownMenuItem
                            onClick={() => handleColorTheme(theme)}
                          >
                            {theme}
                          </DropdownMenuItem>
                        </React.Fragment>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Separator />
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="sh-conv-settings-section-title text-sm font-medium">
                    Custom CSS
                  </label>
                  <Button
                    size="sm"
                    onClick={saveCustomCss}
                    disabled={cssSaving}
                    className="hover:cursor-pointer"
                  >
                    {cssSaving ? "Saving..." : "Apply"}
                  </Button>
                </div>
                <Editor
                  className="sh-conv-css-editor"
                  height="300px"
                  defaultLanguage="css"
                  theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
                  value={customCss}
                  onChange={(v) => setCustomCss(v ?? "")}
                  onMount={(editor, monaco) => {
                    registerShadcnExtension(monaco)
                    editor.addCommand(monaco.KeyCode.F1, () => {})
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    tabSize: 2,
                    contextmenu: false,
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true,
                  }}
                />
              </div>
            </div>
          )}

          {/* About */}
          {activeTab === "About" && (
            <div className="sh-conv-settings-content space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">About</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchStats}
                  disabled={statsLoading}
                  className="mr-8"
                >
                  <RefreshCw
                    className={`mr-2 h-3 w-3 ${statsLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
              <Separator />
              <p className="text-sm">
                <span className="font-semibold">Version: </span>1.0.0
              </p>
              <Separator />
              {stats ? (
                <div className="space-y-4 text-sm text-muted-foreground">
                  {stats.nextServer && (
                    <div className="space-y-1">
                      <p className="sh-conv-settings-section-title font-medium text-foreground">
                        Frontend Server (Node.js)
                      </p>
                      <div className="flex justify-between">
                        <span>Process RAM</span>
                        <span>{stats.nextServer.ram_mb} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Load Average</span>
                        <span>{stats.nextServer.load_avg}</span>
                      </div>
                    </div>
                  )}
                  {stats.backend && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <p className="sh-conv-settings-section-title font-medium text-foreground">
                          Backend (Python)
                        </p>
                        <div className="flex justify-between">
                          <span>Process RAM</span>
                          <span>{stats.backend.ram_mb} MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Process CPU Usage</span>
                          <span>{stats.backend.cpu_percent}%</span>
                        </div>
                      </div>
                    </>
                  )}
                  {stats.system && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <p className="sh-conv-settings-section-title font-medium text-foreground">
                          Host
                        </p>
                        <div className="flex justify-between">
                          <span>CPU Load</span>
                          <span>{stats.system.cpu_percent}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available RAM</span>
                          <span>
                            {stats.system.available_ram_mb} MB /{" "}
                            {stats.system.total_ram_mb} MB
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
