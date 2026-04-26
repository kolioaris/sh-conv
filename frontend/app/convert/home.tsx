"use client"
import TopBar from "@/components/ui/topbar"
import { Button } from "@/components/ui/button"
import { Upload, X, Download, Settings2 } from "lucide-react"
import { toast } from "sonner"
import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ConvertOptionsPopup,
  DEFAULT_OPTIONS,
  ConvertOptions,
} from "@/components/ui/convert-options"
import Footer from "@/components/ui/footer"

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

const IMAGE_MIME =
  "image/png,image/jpeg,image/webp,image/avif,image/tiff,image/bmp,image/x-icon,image/jp2,image/vnd.adobe.photoshop"
const VIDEO_MIME =
  "video/mp4,video/x-matroska,video/x-msvideo,video/quicktime,video/webm,video/x-flv,video/x-m4v,video/ogg,video/mpeg"
const AUDIO_MIME =
  "audio/mpeg,audio/aac,audio/flac,audio/opus,audio/wav,audio/ogg,audio/mp4,audio/aiff,audio/x-m4a"

const VIDEO_EXTS = new Set(VIDEO_FORMATS)
const AUDIO_EXTS = new Set(AUDIO_FORMATS)

function getFileType(file: File): "image" | "video" | "audio" | null {
  if (file.type.startsWith("image/")) return "image"
  if (file.type.startsWith("video/")) return "video"
  if (file.type.startsWith("audio/")) return "audio"
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (ext && VIDEO_EXTS.has(ext)) return "video"
  if (ext && AUDIO_EXTS.has(ext)) return "audio"
  return "image"
}

export default function Page() {
  const [files, setFiles] = useState<File[]>([])
  const [converting, setConverting] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [options, setOptions] = useState<ConvertOptions>(DEFAULT_OPTIONS)
  const [apiBase, setApiBase] = useState("http://localhost:8000")

  const searchParams = useSearchParams()
  const typeParam = searchParams.get("type") as
    | "image"
    | "video"
    | "audio"
    | null
  const formatParam = searchParams.get("format")

  const [outputFormat, setOutputFormat] = useState<string | null>(null)

  useEffect(() => {
    if (formatParam) {
      const t = setTimeout(() => setOutputFormat(formatParam), 0)
      return () => clearTimeout(t)
    }
  }, [formatParam])

  const fileType = files.length > 0 ? getFileType(files[0]) : null
  const effectiveType = fileType ?? typeParam

  const acceptType =
    typeParam === "video"
      ? VIDEO_MIME
      : typeParam === "audio"
        ? AUDIO_MIME
        : typeParam === "image"
          ? IMAGE_MIME
          : `${IMAGE_MIME},${VIDEO_MIME},${AUDIO_MIME}`

  const availableFormats =
    effectiveType === "video"
      ? { Video: VIDEO_FORMATS, Audio: AUDIO_FORMATS }
      : effectiveType === "audio"
        ? { Audio: AUDIO_FORMATS }
        : { Image: IMAGE_FORMATS }

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
        if (!formatParam) {
          if (typeParam === "image")
            setOutputFormat(data.defaultImageFormat ?? "png")
          else if (typeParam === "video")
            setOutputFormat(data.defaultVideoFormat ?? "mp4")
          else if (typeParam === "audio")
            setOutputFormat(data.defaultAudioFormat ?? "mp3")
        }

        setOptions({
          quality: data.defaultImageQuality ?? 90,
          lossless: false,
          strip_metadata: false,
          scale: data.defaultImageScale ?? 1.0,
          crf: data.defaultVideoCrf ?? 23,
          resolution: data.defaultVideoResolution ?? "",
          fps: data.defaultVideoFps ?? "",
          audio_bitrate: data.defaultAudioBitrate ?? "192k",
          bitrate: data.defaultAudioBitrate ?? "192k",
          sample_rate: data.defaultAudioSampleRate ?? 44100,
          channels: data.defaultAudioChannels ?? 2,
          metadata: {},
        })
      })
      .catch(() => console.warn("Could not fetch settings"))
  }, [typeParam, formatParam])

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    })
  }, [])

  const onFileValidate = React.useCallback(
    (file: File): string | null => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
      const allValid = new Set([
        ...IMAGE_FORMATS,
        ...VIDEO_FORMATS,
        ...AUDIO_FORMATS,
      ])
      if (!allValid.has(ext)) return `Unsupported format: .${ext}`
      if (typeParam === "image" && !IMAGE_FORMATS.includes(ext))
        return `Only image files are allowed`
      if (typeParam === "video" && !VIDEO_FORMATS.includes(ext))
        return `Only video files are allowed`
      if (typeParam === "audio" && !AUDIO_FORMATS.includes(ext))
        return `Only audio files are allowed`
      return null
    },
    [typeParam]
  )

  function handleFilesChange(newFiles: File[]) {
    setFiles(newFiles)
    if (!formatParam) setOutputFormat(null)
  }

  async function handleConvert() {
    if (files.length === 0) {
      toast.error("Please upload a file first.")
      return
    }
    if (!outputFormat) {
      toast.error("Please select an output format.")
      return
    }

    setConverting(true)

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("output_format", outputFormat)
        formData.append("options", JSON.stringify(options))

        const res = await fetch(`${apiBase}/convert`, {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          toast.error(`Failed to convert ${file.name}`)
          continue
        }

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${file.name.substring(0, file.name.lastIndexOf(".")) || file.name}.${outputFormat}`
        a.style.display = "none"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 100)

        toast.success(`Converted ${file.name} to .${outputFormat}`)
      } catch (err) {
        console.error(err)
        toast.error(`Error converting ${file.name}`)
      }
    }

    setConverting(false)
  }

  return (
    <div
      suppressHydrationWarning
      className="sh-conv-page flex min-h-screen flex-col"
    >
      <TopBar />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <FileUpload
          value={files}
          onValueChange={handleFilesChange}
          onFileReject={onFileReject}
          onFileValidate={onFileValidate}
          accept={acceptType}
          className="w-full max-w-md"
          multiple
        >
          <FileUploadDropzone className="sh-conv-dropzone">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center rounded-full border p-2.5">
                <Upload
                  className="sh-conv-dropzone-icon size-6 text-muted-foreground"
                  suppressHydrationWarning
                />
              </div>
              <p className="sh-conv-dropzone-text text-sm font-medium">
                Drag & drop files here
              </p>
              <p className="text-xs text-muted-foreground">
                {typeParam
                  ? `Only ${typeParam} files accepted`
                  : "Or click to browse"}
              </p>
            </div>
            <FileUploadTrigger asChild>
              <Button size="sm" className="sh-conv-dropzone-btn mt-2 w-fit">
                Browse files
              </Button>
            </FileUploadTrigger>
          </FileUploadDropzone>

          <FileUploadList>
            {files.map((file) => (
              <FileUploadItem
                className="sh-conv-file-item"
                key={`${file.name}-${file.size}-${file.lastModified}`}
                value={file}
              >
                <FileUploadItemPreview className="sh-conv-file-preview" />
                <FileUploadItemMetadata className="sh-conv-file-metadata" />
                <FileUploadItemDelete asChild>
                  <Button
                    variant="ghost"
                    className="sh-conv-file-delete-btn size-7"
                  >
                    <X />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>

        {/* Controls */}
        <div className="sh-conv-format-select flex w-full max-w-md items-center gap-2">
          <Select
            value={outputFormat ?? ""}
            onValueChange={(v) => setOutputFormat(v)}
            disabled={!effectiveType}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableFormats).map(([group, formats]) => (
                <SelectGroup key={group}>
                  <SelectLabel>{group}</SelectLabel>
                  {formats.map((fmt: string) => (
                    <SelectItem key={fmt} value={fmt}>
                      .{fmt}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            disabled={!effectiveType}
            onClick={() => setOptionsOpen(true)}
            className="sh-conv-convert-options-btn hover:cursor-pointer"
          >
            <Settings2 className="size-4" />
          </Button>

          <Button
            onClick={handleConvert}
            disabled={converting || files.length === 0 || !outputFormat}
            className="sh-conv-convert-btn hover:cursor-pointer"
          >
            {converting ? (
              "Converting..."
            ) : (
              <>
                <Download className="mr-1 size-4" />
                Convert
              </>
            )}
          </Button>
        </div>
      </div>

      <ConvertOptionsPopup
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        fileType={effectiveType}
        options={options}
        onChange={setOptions}
        outputFormat={outputFormat}
      />

      <Footer />
    </div>
  )
}
