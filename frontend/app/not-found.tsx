"use client"
import TopBar from "@/components/ui/topbar"
import { Button } from "@/components/ui/button"
import { FaGithub } from "react-icons/fa"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, BookSearch } from "lucide-react"

export default function Page() {
  return (
    // Main div
    <div
      suppressHydrationWarning
      className="sh-conv-page flex min-h-screen flex-col"
    >
      <TopBar />
      <div>
        <h1 className="mt-10 text-center text-5xl font-semibold">
          <span className="font-bold">404</span> - Not found
        </h1>

        <div className="flex justify-center pt-5">
          <Button asChild className="relative items-center justify-center">
            <Link href="/">
              <ArrowLeft />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
      <footer className="mt-auto">
        <Separator />
        <div className="flex items-center justify-center py-6">
          <Link
            href="https://github.com/kolioaris/sh-conv"
            target="_blank"
            className="mx-1"
          >
            <FaGithub suppressHydrationWarning size={25} color="#909090" />{" "}
          </Link>
          <Link
            href="https://kolioaris.xyz/documentation/sh-conv"
            target="_blank"
            className="mx-1"
          >
            <BookSearch suppressHydrationWarning size={25} color="#909090" />
          </Link>
        </div>
      </footer>
    </div>
  )
}
