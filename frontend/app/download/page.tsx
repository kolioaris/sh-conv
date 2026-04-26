import type { Metadata } from "next"
import PageClient from "./home"

export const metadata: Metadata = {
  title: "Download Media",
}

export default function Page() {
  return <PageClient />
}
