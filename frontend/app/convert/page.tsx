import type { Metadata } from "next"
import PageClient from "./home"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Convert Files",
}

export default function Page() {
  return (
    <Suspense>
      <PageClient />
    </Suspense>
  )
}
