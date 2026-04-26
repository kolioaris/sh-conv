"use client"
import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Button } from "./button"
import { Separator } from "./separator"
import { Input } from "./input"
import { Slider } from "./slider"
import { Switch } from "./switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

/* eslint-disable react-hooks/set-state-in-effect */

const LOSSLESS_SUPPORTED = ["webp", "avif", "heif", "png"]

export interface ConvertOptions {
  quality: number
  lossless: boolean
  strip_metadata: boolean
  scale: number
  crf: number
  resolution: string
  fps: number | ""
  audio_bitrate: string
  bitrate: string
  sample_rate: number
  channels: number
  metadata: Record<string, string>
}

export const DEFAULT_OPTIONS: ConvertOptions = {
  quality: 90,
  lossless: false,
  strip_metadata: false,
  scale: 1.0,
  crf: 23,
  resolution: "",
  fps: "",
  audio_bitrate: "192k",
  bitrate: "192k",
  sample_rate: 44100,
  channels: 2,
  metadata: {},
}

type FileType = "image" | "video" | "audio" | null

interface Props {
  open: boolean
  onClose: () => void
  fileType: FileType
  options: ConvertOptions
  onChange: (opts: ConvertOptions) => void
  outputFormat: string | null
}

export function ConvertOptionsPopup({
  open,
  onClose,
  fileType,
  options,
  onChange,
  outputFormat,
}: Props) {
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(false)
  const [metaKey, setMetaKey] = useState("")
  const [metaValue, setMetaValue] = useState("")
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

  function set<K extends keyof ConvertOptions>(
    key: K,
    value: ConvertOptions[K]
  ) {
    onChange({ ...options, [key]: value })
  }

  function addMetadata() {
    if (!metaKey) return
    onChange({
      ...options,
      metadata: { ...options.metadata, [metaKey]: metaValue },
    })
    setMetaKey("")
    setMetaValue("")
  }

  function removeMetadata(key: string) {
    const updated = { ...options.metadata }
    delete updated[key]
    onChange({ ...options, metadata: updated })
  }

  const losslessSupported =
    !!outputFormat && LOSSLESS_SUPPORTED.includes(outputFormat)

  return (
    <div
      onClick={onClose}
      className={`sh-conv-options-modal fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex h-5/6 w-11/12 max-w-lg flex-col overflow-hidden rounded-lg border bg-background transition-all duration-200 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Conversion Options</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:cursor-pointer"
          >
            <X />
          </Button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Image Options */}
          {fileType === "image" && (
            <div>
              <h3 className="sh-conv-options-section-title text-md mb-3 font-medium">
                Image
              </h3>
              <Separator className="mb-4" />

              {/* Quality */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Quality</label>
                  <span className="text-muted-foreground">
                    {options.quality}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[options.quality]}
                  disabled={options.lossless}
                  onValueChange={([v]) => set("quality", v)}
                />
              </div>

              {/* Scale */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <label>Scale</label>
                  <span className="text-muted-foreground">
                    {options.scale}x
                  </span>
                </div>
                <Slider
                  min={0.1}
                  max={4}
                  step={0.1}
                  value={[options.scale]}
                  onValueChange={([v]) => set("scale", v)}
                />
              </div>

              {/* Lossless */}
              <div className="mb-4 flex items-center justify-between text-sm">
                <label
                  className={!losslessSupported ? "text-muted-foreground" : ""}
                >
                  Lossless{" "}
                  {!losslessSupported ? "(not supported for this format)" : ""}
                </label>
                <Switch
                  checked={options.lossless}
                  disabled={!losslessSupported}
                  onCheckedChange={(v) => set("lossless", v)}
                />
              </div>

              {/* Strip Metadata */}
              <div className="flex items-center justify-between text-sm">
                <label>Strip Metadata</label>
                <Switch
                  checked={options.strip_metadata}
                  onCheckedChange={(v) => set("strip_metadata", v)}
                />
              </div>
            </div>
          )}

          {/* Video Options */}
          {fileType === "video" && (
            <div>
              <h3 className="sh-conv-options-section-title text-md mb-3 font-medium">
                Video
              </h3>
              <Separator className="mb-4" />

              {/* CRF */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <label>
                    Quality/CRF{" "}
                    <span className="font-light italic">(lower is better)</span>
                  </label>
                  <span className="text-muted-foreground">{options.crf}</span>
                </div>
                <Slider
                  min={0}
                  max={51}
                  step={1}
                  value={[options.crf]}
                  onValueChange={([v]) => set("crf", v)}
                />
              </div>
              <div className="mb-4 flex items-center justify-between text-sm">
                <label>Resolution</label>
                <Select
                  value={options.resolution || "original"}
                  onValueChange={(v) =>
                    set("resolution", v === "original" ? "" : v)
                  }
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Original" />
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

              {/* FPS */}
              <div className="mb-4 flex items-center justify-between text-sm">
                <label>FPS</label>
                <Select
                  value={options.fps === "" ? "original" : String(options.fps)}
                  onValueChange={(v) =>
                    set("fps", v === "original" ? "" : Number(v))
                  }
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Original" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                  </SelectContent>
                </Select>{" "}
              </div>

              {/* Audio Bitrate */}
              <div className="flex items-center justify-between text-sm">
                <label>Audio Bitrate</label>
                <Select
                  value={options.audio_bitrate}
                  onValueChange={(v) => set("audio_bitrate", v)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="320k">320k</SelectItem>
                    <SelectItem value="192k">192k</SelectItem>
                    <SelectItem value="128k">128k</SelectItem>
                    <SelectItem value="96k">96k</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Audio Options */}
          {fileType === "audio" && (
            <div>
              <h3 className="sh-conv-options-section-title text-md mb-3 font-medium">
                Audio
              </h3>
              <Separator className="mb-4" />

              {/* Bitrate */}
              <div className="mb-4 flex items-center justify-between text-sm">
                <label>Bitrate</label>
                <Select
                  value={options.bitrate}
                  onValueChange={(v) => set("bitrate", v)}
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

              {/* Sample Rate */}
              <div className="mb-4 flex items-center justify-between text-sm">
                <label>Sample Rate</label>
                <Select
                  value={String(options.sample_rate)}
                  onValueChange={(v) => set("sample_rate", Number(v))}
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

              {/* Channels */}
              <div className="flex items-center justify-between text-sm">
                <label>Channels</label>
                <Select
                  value={String(options.channels)}
                  onValueChange={(v) => set("channels", Number(v))}
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
          )}

          {/* Metadata */}
          {fileType && (
            <div>
              <h3 className="sh-conv-options-section-title mb-3 text-sm font-medium">
                Metadata
              </h3>
              <Separator className="mb-4" />

              {Object.entries(options.metadata).map(([key, value]) => (
                <div
                  key={key}
                  className="mb-2 flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {key}: {value}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 hover:cursor-pointer"
                    onClick={() => removeMetadata(key)}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}

              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="Key"
                  value={metaKey}
                  onChange={(e) => setMetaKey(e.target.value)}
                />
                <Input
                  placeholder="Value"
                  value={metaValue}
                  onChange={(e) => setMetaValue(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={addMetadata}
                  className="hover:cursor-pointer"
                >
                  Add
                </Button>
              </div>
            </div>
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
          <Button
            onClick={onClose}
            className="sh-conv-options-save-btn hover:cursor-pointer"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
