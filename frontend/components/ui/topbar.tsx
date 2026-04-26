"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Search, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SettingsPopup } from "./settings"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "./kbd"

export default function TopBar() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  const [mounted, setMounted] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const runCommand = (action: () => void) => {
    setCommandOpen(false)
    action()
  }

  if (!mounted) return null

  return (
    <div suppressHydrationWarning>
      <div className="sh-conv-topbar flex items-center justify-between px-4 py-2 md:grid md:grid-cols-3">
        {/* Logo */}
        <div className="flex justify-start">
          <Link href="/" draggable={false}>
            <Image
              src={
                resolvedTheme === "light"
                  ? "/banner-dark.svg"
                  : "/banner-white.svg"
              }
              alt="logo"
              width={130}
              height={40}
              className="sh-conv-topbar-logo pointer-events-none select-none md:w-37.5"
              loading="eager"
            />
          </Link>
        </div>

        <div className="flex items-center justify-end gap-2 md:justify-center">
          <Button
            onClick={() => setCommandOpen(true)}
            variant="outline"
            className="sh-conv-topbar-search-btn flex items-center gap-2 px-3 hover:cursor-pointer md:px-4"
          >
            <Search className="h-4 w-4" />
            <span className="hidden text-muted-foreground sm:inline">
              Find anything...
              <KbdGroup className="ml-5">
                <Kbd>Ctrl</Kbd>
                <Kbd>P</Kbd>
              </KbdGroup>
            </span>
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="sh-conv-topbar-settings-btn hover:cursor-pointer md:absolute md:right-4"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden md:block" />
      </div>

      <Separator className="sh-conv-topbar-separator" />

      <CommandDialog
        className="sh-conv-command-modal"
        open={commandOpen}
        onOpenChange={setCommandOpen}
      >
        <Command>
          <CommandInput
            className="sh-conv-command-input"
            placeholder="Type a command or search..."
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup className="sh-conv-command-group" heading="Pages">
              <CommandItem
                onSelect={() => runCommand(() => router.push("/"))}
                className="sh-conv-command-item hover:cursor-pointer"
              >
                <span>Home</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => router.push("/convert"))}
                className="sh-conv-command-item hover:cursor-pointer"
              >
                <span>Convert</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => router.push("/download"))}
                className="sh-conv-command-item hover:cursor-pointer"
              >
                <span>Download</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup className="sh-conv-command-group" heading="Convert">
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/convert?type=image"))
                }
                className="sh-conv-command-item hover:cursor-pointer"
              >
                <span>Convert Image</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/convert?type=video"))
                }
                className="sh-conv-command-item hover:cursor-pointer"
              >
                <span>Convert Video</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/convert?type=audio"))
                }
                className="sh-conv-command-item hover:cursor-pointer"
              >
                <span>Convert Audio</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup
              className="sh-conv-command-group"
              heading="Convert Image"
            >
              {[
                "png",
                "jpg",
                "webp",
                "avif",
                "tiff",
                "bmp",
                "ico",
                "jp2",
                "psd",
              ].map((fmt) => (
                <CommandItem
                  key={fmt}
                  onSelect={() =>
                    runCommand(() =>
                      router.push(`/convert?type=image&format=${fmt}`)
                    )
                  }
                  className="sh-conv-command-item hover:cursor-pointer"
                >
                  <span>Convert to .{fmt}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup
              className="sh-conv-command-group"
              heading="Convert Video"
            >
              {[
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
              ].map((fmt) => (
                <CommandItem
                  key={fmt}
                  onSelect={() =>
                    runCommand(() =>
                      router.push(`/convert?type=video&format=${fmt}`)
                    )
                  }
                  className="sh-conv-command-item hover:cursor-pointer"
                >
                  <span>Convert to .{fmt}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup
              className="sh-conv-command-group"
              heading="Convert Audio"
            >
              {["mp3", "aac", "flac", "opus", "wav", "ogg", "m4a", "aiff"].map(
                (fmt) => (
                  <CommandItem
                    key={fmt}
                    onSelect={() =>
                      runCommand(() =>
                        router.push(`/convert?type=audio&format=${fmt}`)
                      )
                    }
                    className="sh-conv-command-item hover:cursor-pointer"
                  >
                    <span>Convert to .{fmt}</span>
                  </CommandItem>
                )
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      <SettingsPopup
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
