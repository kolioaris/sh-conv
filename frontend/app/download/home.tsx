"use client"
import TopBar from "@/components/ui/topbar"
import Footer from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Settings2, X } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect, useRef } from "react"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

/* eslint-disable react-hooks/set-state-in-effect */

interface DownloadOptions {
  embed_thumbnail: boolean
  embed_metadata: boolean
  audio_sample_rate: number
  audio_channels: number
}

const DEFAULT_DOWNLOAD_OPTIONS: DownloadOptions = {
  embed_thumbnail: false,
  embed_metadata: false,
  audio_sample_rate: 44100,
  audio_channels: 2,
}

function DownloadOptionsPopup({
  open,
  onClose,
  options,
  onChange,
  format,
}: {
  open: boolean
  onClose: () => void
  options: DownloadOptions
  onChange: (o: DownloadOptions) => void
  format: string
}) {
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (open && !show) setShow(true)

  useEffect(() => {
    if (open) {
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

  function set<K extends keyof DownloadOptions>(
    key: K,
    value: DownloadOptions[K]
  ) {
    onChange({ ...options, [key]: value })
  }

  return (
    <div
      onClick={onClose}
      className={`sh-conv-download-options-modal fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex w-11/12 max-w-md flex-col overflow-hidden rounded-lg border bg-background transition-all duration-200 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Download Options</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:cursor-pointer"
          >
            <X />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          {/* General */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">General</h3>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <label>Embed Thumbnail</label>
              <Switch
                checked={options.embed_thumbnail}
                onCheckedChange={(v) => set("embed_thumbnail", v)}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label>Embed Metadata</label>
              <Switch
                checked={options.embed_metadata}
                onCheckedChange={(v) => set("embed_metadata", v)}
              />
            </div>
          </div>

          {/* Audio Settings */}
          {format === "mp3" && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Audio</h3>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <label>Sample Rate</label>
                  <Select
                    value={String(options.audio_sample_rate)}
                    onValueChange={(v) => set("audio_sample_rate", Number(v))}
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
                    value={String(options.audio_channels)}
                    onValueChange={(v) => set("audio_channels", Number(v))}
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:cursor-pointer"
          >
            Cancel
          </Button>
          <Button onClick={onClose} className="hover:cursor-pointer">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState("mp4")
  const [quality, setQuality] = useState("best")
  const [downloading, setDownloading] = useState(false)
  const [apiBase, setApiBase] = useState("http://localhost:8000")
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [options, setOptions] = useState<DownloadOptions>(
    DEFAULT_DOWNLOAD_OPTIONS
  )

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        const base = data.api_base || "http://localhost:8000"
        setApiBase(base)
        return fetch(`${base}/settings`)
      })
      .then((res) => res.json())
      .then((data) => {
        setFormat(data.defaultDownloadFormat ?? "mp4")
        setQuality(data.defaultDownloadQuality ?? "best")
        setOptions({
          embed_thumbnail: data.defaultDownloadEmbedThumbnail ?? false,
          embed_metadata: data.defaultDownloadEmbedMetadata ?? false,
          audio_sample_rate: data.defaultDownloadAudioSampleRate ?? 44100,
          audio_channels: data.defaultDownloadAudioChannels ?? 2,
        })
      })
      .catch(() => {})
  }, [])

  const videoQualities = [
    { value: "best", label: "Best" },
    { value: "1080", label: "1080p" },
    { value: "720", label: "720p" },
    { value: "480", label: "480p" },
    { value: "360", label: "360p" },
  ]

  const audioQualities = [
    { value: "320", label: "320 kbps" },
    { value: "192", label: "192 kbps" },
    { value: "128", label: "128 kbps" },
    { value: "96", label: "96 kbps" },
  ]

  const qualities = format === "mp3" ? audioQualities : videoQualities

  function handleFormatChange(val: string) {
    setFormat(val)
    setQuality(val === "mp3" ? "192" : "best")
  }

  async function handleDownload() {
    if (!url.trim()) {
      toast.error("Please enter a URL.")
      return
    }

    setDownloading(true)
    toast.info("Downloading... this may take a while.")

    try {
      const res = await fetch(`${apiBase}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format, quality, options }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(`Download failed: ${err.detail}`)
        return
      }

      const disposition = res.headers.get("Content-Disposition") ?? ""
      const filenameMatch = disposition.match(/filename=(.+)/)
      const filename = filenameMatch ? filenameMatch[1] : `download.${format}`

      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl
      a.download = filename
      a.style.display = "none"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100)

      toast.success("Download complete!")
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      suppressHydrationWarning
      className="sh-conv-page flex min-h-screen flex-col"
    >
      <TopBar />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="w-full max-w-md space-y-4">
          <div>
            <h1 className="sh-conv-download-title text-2xl font-semibold">
              Download
            </h1>
            <p className="sh-conv-download-description text-sm text-muted-foreground">
              Supports YouTube, Twitter, Instagram, SoundCloud, and{" "}
              <a
                href="https://kolioaris.xyz/docs/sh-conv/supported-download-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                1000+ more sites
              </a>
            </p>
          </div>

          {/* URL Input */}
          <Input
            placeholder="Paste URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDownload()}
            className="sh-conv-download-url-input"
          />

          {/* Format / Quality / Options */}
          <div className="flex gap-2">
            <Select value={format} onValueChange={handleFormatChange}>
              <SelectTrigger className="sh-conv-download-format-select w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Format</SelectLabel>
                  <SelectItem value="mp4">MP4 (Video)</SelectItem>
                  <SelectItem value="mp3">MP3 (Audio)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger className="sh-conv-download-quality-select flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Quality</SelectLabel>
                  {qualities.map((q) => (
                    <SelectItem key={q.value} value={q.value}>
                      {q.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setOptionsOpen(true)}
              className="sh-conv-download-options-btn hover:cursor-pointer"
            >
              <Settings2 className="size-4" />
            </Button>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            disabled={downloading || !url.trim()}
            className="sh-conv-download-btn w-full hover:cursor-pointer"
          >
            {downloading ? (
              "Downloading..."
            ) : (
              <>
                <Download className="mr-2 size-4" />
                Download
              </>
            )}
          </Button>
        </div>
      </div>

      <DownloadOptionsPopup
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        options={options}
        onChange={setOptions}
        format={format}
      />

      <Footer />
    </div>
  )
}
