import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), "..", "config.json")
    const raw = fs.readFileSync(configPath, "utf-8")
    const config = JSON.parse(raw)
    return NextResponse.json(config)
  } catch {
    return NextResponse.json({
      api_base: "http://localhost:8000"
    })
  }
}