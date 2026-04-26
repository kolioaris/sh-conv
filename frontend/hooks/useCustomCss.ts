export function applyCustomCss(css: string) {
  let style = document.getElementById("custom-css") as HTMLStyleElement | null
  if (!style) {
    style = document.createElement("style")
    style.id = "custom-css"
    document.head.appendChild(style)
  }
  style.textContent = css
}