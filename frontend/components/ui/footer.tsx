import Link from "next/link"
import { Separator } from "./separator"
import { FaGithub } from "react-icons/fa"
import { BookSearch } from "lucide-react"

export default function Footer() {
  return (
    <footer className="sh-conv-footer mt-auto">
      <Separator />
      <div className="flex items-center justify-center py-6">
        <Link
          href="https://github.com/kolioaris/sh-conv"
          target="_blank"
          className="mx-1"
        >
          <FaGithub suppressHydrationWarning size={20} color="#909090" />
        </Link>
        <Link
          href="https://kolioaris.xyz/docs/sh-conv"
          target="_blank"
          className="mx-1"
        >
          <BookSearch suppressHydrationWarning size={20} color="#909090" />
        </Link>
      </div>
    </footer>
  )
}
