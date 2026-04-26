import type { Metadata } from "next"
import PageClient from "./home"

export const metadata: Metadata = {
  title: "Home | sh-conv",
}

export default function Page() {
  return <PageClient />
}
