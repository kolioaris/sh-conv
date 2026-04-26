"use client"
import TopBar from "@/components/ui/topbar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Footer from "@/components/ui/footer"

export default function Page() {
  return (
    // Main div
    <div
      suppressHydrationWarning
      className="sh-conv-page flex min-h-screen flex-col"
    >
      <TopBar />
      <div className="m-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Convert Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">Convert files to another format easily.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/convert">Convert</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Download media
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">
              Download video/audio from a big variety of supported services.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/download">Download</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
