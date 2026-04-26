import { useEffect } from "react"

const THEMES: Record<string, { root: Record<string, string>; dark: Record<string, string> }> = {
  Default: { root: {
      "--primary": "oklch(0.488 0.243 264.376)",
      "--chart-1": "oklch(0.809 0.105 251.813)",
      "--chart-2": "oklch(0.623 0.214 259.815)",
      "--chart-3": "oklch(0.546 0.245 262.881)",
      "--chart-4": "oklch(0.488 0.243 264.376)",
      "--chart-5": "oklch(0.424 0.199 265.638)",
      "--sidebar-primary": "oklch(0.546 0.245 262.881)",
    },
    dark: {
      "--primary": "oklch(0.424 0.199 265.638)",
      "--chart-1": "oklch(0.809 0.105 251.813)",
      "--chart-2": "oklch(0.623 0.214 259.815)",
      "--chart-3": "oklch(0.546 0.245 262.881)",
      "--chart-4": "oklch(0.488 0.243 264.376)",
      "--chart-5": "oklch(0.424 0.199 265.638)",
      "--sidebar-primary": "oklch(0.623 0.214 259.815)",
    }, },
  Amber: {
    root: {
      "--primary": "oklch(0.555 0.163 48.998)",
      "--chart-1": "oklch(0.879 0.169 91.605)",
      "--chart-2": "oklch(0.769 0.188 70.08)",
      "--chart-3": "oklch(0.666 0.179 58.318)",
      "--chart-4": "oklch(0.555 0.163 48.998)",
      "--chart-5": "oklch(0.473 0.137 46.201)",
      "--sidebar-primary": "oklch(0.666 0.179 58.318)",
    },
    dark: {
      "--primary": "oklch(0.473 0.137 46.201)",
      "--chart-1": "oklch(0.879 0.169 91.605)",
      "--chart-2": "oklch(0.769 0.188 70.08)",
      "--chart-3": "oklch(0.666 0.179 58.318)",
      "--chart-4": "oklch(0.555 0.163 48.998)",
      "--chart-5": "oklch(0.473 0.137 46.201)",
      "--sidebar-primary": "oklch(0.769 0.188 70.08)",
      "--sidebar-primary-foreground": "oklch(0.279 0.077 45.635)",
    },
  },
  Blue: {
    root: {
      "--primary": "oklch(0.488 0.243 264.376)",
      "--chart-1": "oklch(0.809 0.105 251.813)",
      "--chart-2": "oklch(0.623 0.214 259.815)",
      "--chart-3": "oklch(0.546 0.245 262.881)",
      "--chart-4": "oklch(0.488 0.243 264.376)",
      "--chart-5": "oklch(0.424 0.199 265.638)",
      "--sidebar-primary": "oklch(0.546 0.245 262.881)",
    },
    dark: {
      "--primary": "oklch(0.424 0.199 265.638)",
      "--chart-1": "oklch(0.809 0.105 251.813)",
      "--chart-2": "oklch(0.623 0.214 259.815)",
      "--chart-3": "oklch(0.546 0.245 262.881)",
      "--chart-4": "oklch(0.488 0.243 264.376)",
      "--chart-5": "oklch(0.424 0.199 265.638)",
      "--sidebar-primary": "oklch(0.623 0.214 259.815)",
    },
  },
  Cyan: {
    root: {
      "--primary": "oklch(0.52 0.105 223.128)",
      "--chart-1": "oklch(0.865 0.127 207.078)",
      "--chart-2": "oklch(0.715 0.143 215.221)",
      "--chart-3": "oklch(0.609 0.126 221.723)",
      "--chart-4": "oklch(0.52 0.105 223.128)",
      "--chart-5": "oklch(0.45 0.085 224.283)",
      "--sidebar-primary": "oklch(0.609 0.126 221.723)",
    },
    dark: {
      "--primary": "oklch(0.45 0.085 224.283)",
      "--chart-1": "oklch(0.865 0.127 207.078)",
      "--chart-2": "oklch(0.715 0.143 215.221)",
      "--chart-3": "oklch(0.609 0.126 221.723)",
      "--chart-4": "oklch(0.52 0.105 223.128)",
      "--chart-5": "oklch(0.45 0.085 224.283)",
      "--sidebar-primary": "oklch(0.715 0.143 215.221)",
      "--sidebar-primary-foreground": "oklch(0.302 0.056 229.695)",
    },
  },
  Emerald: {
    root: {
      "--primary": "oklch(0.508 0.118 165.612)",
      "--chart-1": "oklch(0.845 0.143 164.978)",
      "--chart-2": "oklch(0.696 0.17 162.48)",
      "--chart-3": "oklch(0.596 0.145 163.225)",
      "--chart-4": "oklch(0.508 0.118 165.612)",
      "--chart-5": "oklch(0.432 0.095 166.913)",
      "--sidebar-primary": "oklch(0.596 0.145 163.225)",
    },
    dark: {
      "--primary": "oklch(0.432 0.095 166.913)",
      "--chart-1": "oklch(0.845 0.143 164.978)",
      "--chart-2": "oklch(0.696 0.17 162.48)",
      "--chart-3": "oklch(0.596 0.145 163.225)",
      "--chart-4": "oklch(0.508 0.118 165.612)",
      "--chart-5": "oklch(0.432 0.095 166.913)",
      "--sidebar-primary": "oklch(0.696 0.17 162.48)",
      "--sidebar-primary-foreground": "oklch(0.262 0.051 172.552)",
    },
  },
  Fuchsia: {
    root: {
      "--primary": "oklch(0.518 0.253 323.949)",
      "--chart-1": "oklch(0.833 0.145 321.434)",
      "--chart-2": "oklch(0.667 0.295 322.15)",
      "--chart-3": "oklch(0.591 0.293 322.896)",
      "--chart-4": "oklch(0.518 0.253 323.949)",
      "--chart-5": "oklch(0.452 0.211 324.591)",
      "--sidebar-primary": "oklch(0.591 0.293 322.896)",
    },
    dark: {
      "--primary": "oklch(0.452 0.211 324.591)",
      "--chart-1": "oklch(0.833 0.145 321.434)",
      "--chart-2": "oklch(0.667 0.295 322.15)",
      "--chart-3": "oklch(0.591 0.293 322.896)",
      "--chart-4": "oklch(0.518 0.253 323.949)",
      "--chart-5": "oklch(0.452 0.211 324.591)",
      "--sidebar-primary": "oklch(0.667 0.295 322.15)",
    },
  },
  Green: {
    root: {
      "--primary": "oklch(0.527 0.154 150.069)",
      "--chart-1": "oklch(0.871 0.15 154.449)",
      "--chart-2": "oklch(0.723 0.219 149.579)",
      "--chart-3": "oklch(0.627 0.194 149.214)",
      "--chart-4": "oklch(0.527 0.154 150.069)",
      "--chart-5": "oklch(0.448 0.119 151.328)",
      "--sidebar-primary": "oklch(0.627 0.194 149.214)",
    },
    dark: {
      "--primary": "oklch(0.448 0.119 151.328)",
      "--chart-1": "oklch(0.871 0.15 154.449)",
      "--chart-2": "oklch(0.723 0.219 149.579)",
      "--chart-3": "oklch(0.627 0.194 149.214)",
      "--chart-4": "oklch(0.527 0.154 150.069)",
      "--chart-5": "oklch(0.448 0.119 151.328)",
      "--sidebar-primary": "oklch(0.723 0.219 149.579)",
    },
  },
  Indigo: {
    root: {
      "--primary": "oklch(0.457 0.24 277.023)",
      "--chart-1": "oklch(0.785 0.115 274.713)",
      "--chart-2": "oklch(0.585 0.233 277.117)",
      "--chart-3": "oklch(0.511 0.262 276.966)",
      "--chart-4": "oklch(0.457 0.24 277.023)",
      "--chart-5": "oklch(0.398 0.195 277.366)",
      "--sidebar-primary": "oklch(0.511 0.262 276.966)",
    },
    dark: {
      "--primary": "oklch(0.398 0.195 277.366)",
      "--chart-1": "oklch(0.785 0.115 274.713)",
      "--chart-2": "oklch(0.585 0.233 277.117)",
      "--chart-3": "oklch(0.511 0.262 276.966)",
      "--chart-4": "oklch(0.457 0.24 277.023)",
      "--chart-5": "oklch(0.398 0.195 277.366)",
      "--sidebar-primary": "oklch(0.585 0.233 277.117)",
    },
  },
  Lime: {
    root: {
      "--primary": "oklch(0.841 0.238 128.85)",
      "--primary-foreground": "oklch(0.405 0.101 131.063)",
      "--chart-1": "oklch(0.897 0.196 126.665)",
      "--chart-2": "oklch(0.768 0.233 130.85)",
      "--chart-3": "oklch(0.648 0.2 131.684)",
      "--chart-4": "oklch(0.532 0.157 131.589)",
      "--chart-5": "oklch(0.453 0.124 130.933)",
      "--sidebar-primary": "oklch(0.648 0.2 131.684)",
    },
    dark: {
      "--primary": "oklch(0.768 0.233 130.85)",
      "--primary-foreground": "oklch(0.405 0.101 131.063)",
      "--chart-1": "oklch(0.897 0.196 126.665)",
      "--chart-2": "oklch(0.768 0.233 130.85)",
      "--chart-3": "oklch(0.648 0.2 131.684)",
      "--chart-4": "oklch(0.532 0.157 131.589)",
      "--chart-5": "oklch(0.453 0.124 130.933)",
      "--sidebar-primary": "oklch(0.768 0.233 130.85)",
      "--sidebar-primary-foreground": "oklch(0.274 0.072 132.109)",
    },
  },
  Orange: {
    root: {
      "--primary": "oklch(0.553 0.195 38.402)",
      "--chart-1": "oklch(0.837 0.128 66.29)",
      "--chart-2": "oklch(0.705 0.213 47.604)",
      "--chart-3": "oklch(0.646 0.222 41.116)",
      "--chart-4": "oklch(0.553 0.195 38.402)",
      "--chart-5": "oklch(0.47 0.157 37.304)",
      "--sidebar-primary": "oklch(0.646 0.222 41.116)",
    },
    dark: {
      "--primary": "oklch(0.47 0.157 37.304)",
      "--chart-1": "oklch(0.837 0.128 66.29)",
      "--chart-2": "oklch(0.705 0.213 47.604)",
      "--chart-3": "oklch(0.646 0.222 41.116)",
      "--chart-4": "oklch(0.553 0.195 38.402)",
      "--chart-5": "oklch(0.47 0.157 37.304)",
      "--sidebar-primary": "oklch(0.705 0.213 47.604)",
    },
  },
  Pink: {
    root: {
      "--primary": "oklch(0.525 0.223 3.958)",
      "--chart-1": "oklch(0.823 0.12 346.018)",
      "--chart-2": "oklch(0.656 0.241 354.308)",
      "--chart-3": "oklch(0.592 0.249 0.584)",
      "--chart-4": "oklch(0.525 0.223 3.958)",
      "--chart-5": "oklch(0.459 0.187 3.815)",
      "--sidebar-primary": "oklch(0.592 0.249 0.584)",
    },
    dark: {
      "--primary": "oklch(0.459 0.187 3.815)",
      "--chart-1": "oklch(0.823 0.12 346.018)",
      "--chart-2": "oklch(0.656 0.241 354.308)",
      "--chart-3": "oklch(0.592 0.249 0.584)",
      "--chart-4": "oklch(0.525 0.223 3.958)",
      "--chart-5": "oklch(0.459 0.187 3.815)",
      "--sidebar-primary": "oklch(0.656 0.241 354.308)",
    },
  },
  Purple: {
    root: {
      "--primary": "oklch(0.496 0.265 301.924)",
      "--chart-1": "oklch(0.827 0.119 306.383)",
      "--chart-2": "oklch(0.627 0.265 303.9)",
      "--chart-3": "oklch(0.558 0.288 302.321)",
      "--chart-4": "oklch(0.496 0.265 301.924)",
      "--chart-5": "oklch(0.438 0.218 303.724)",
      "--sidebar-primary": "oklch(0.558 0.288 302.321)",
    },
    dark: {
      "--primary": "oklch(0.438 0.218 303.724)",
      "--chart-1": "oklch(0.827 0.119 306.383)",
      "--chart-2": "oklch(0.627 0.265 303.9)",
      "--chart-3": "oklch(0.558 0.288 302.321)",
      "--chart-4": "oklch(0.496 0.265 301.924)",
      "--chart-5": "oklch(0.438 0.218 303.724)",
      "--sidebar-primary": "oklch(0.627 0.265 303.9)",
    },
  },
  Red: {
    root: {
      "--primary": "oklch(0.505 0.213 27.518)",
      "--chart-1": "oklch(0.808 0.114 19.571)",
      "--chart-2": "oklch(0.637 0.237 25.331)",
      "--chart-3": "oklch(0.577 0.245 27.325)",
      "--chart-4": "oklch(0.505 0.213 27.518)",
      "--chart-5": "oklch(0.444 0.177 26.899)",
      "--sidebar-primary": "oklch(0.577 0.245 27.325)",
    },
    dark: {
      "--primary": "oklch(0.444 0.177 26.899)",
      "--chart-1": "oklch(0.808 0.114 19.571)",
      "--chart-2": "oklch(0.637 0.237 25.331)",
      "--chart-3": "oklch(0.577 0.245 27.325)",
      "--chart-4": "oklch(0.505 0.213 27.518)",
      "--chart-5": "oklch(0.444 0.177 26.899)",
      "--sidebar-primary": "oklch(0.637 0.237 25.331)",
    },
  },
  Rose: {
    root: {
      "--primary": "oklch(0.514 0.222 16.935)",
      "--chart-1": "oklch(0.81 0.117 11.638)",
      "--chart-2": "oklch(0.645 0.246 16.439)",
      "--chart-3": "oklch(0.586 0.253 17.585)",
      "--chart-4": "oklch(0.514 0.222 16.935)",
      "--chart-5": "oklch(0.455 0.188 13.697)",
      "--sidebar-primary": "oklch(0.586 0.253 17.585)",
    },
    dark: {
      "--primary": "oklch(0.455 0.188 13.697)",
      "--chart-1": "oklch(0.81 0.117 11.638)",
      "--chart-2": "oklch(0.645 0.246 16.439)",
      "--chart-3": "oklch(0.586 0.253 17.585)",
      "--chart-4": "oklch(0.514 0.222 16.935)",
      "--chart-5": "oklch(0.455 0.188 13.697)",
      "--sidebar-primary": "oklch(0.645 0.246 16.439)",
    },
  },
  Sky: {
    root: {
      "--primary": "oklch(0.5 0.134 242.749)",
      "--chart-1": "oklch(0.828 0.111 230.318)",
      "--chart-2": "oklch(0.685 0.169 237.323)",
      "--chart-3": "oklch(0.588 0.158 241.966)",
      "--chart-4": "oklch(0.5 0.134 242.749)",
      "--chart-5": "oklch(0.443 0.11 240.79)",
      "--sidebar-primary": "oklch(0.588 0.158 241.966)",
    },
    dark: {
      "--primary": "oklch(0.443 0.11 240.79)",
      "--chart-1": "oklch(0.828 0.111 230.318)",
      "--chart-2": "oklch(0.685 0.169 237.323)",
      "--chart-3": "oklch(0.588 0.158 241.966)",
      "--chart-4": "oklch(0.5 0.134 242.749)",
      "--chart-5": "oklch(0.443 0.11 240.79)",
      "--sidebar-primary": "oklch(0.685 0.169 237.323)",
      "--sidebar-primary-foreground": "oklch(0.293 0.066 243.157)",
    },
  },
  Teal: {
    root: {
      "--primary": "oklch(0.511 0.096 186.391)",
      "--chart-1": "oklch(0.855 0.138 181.071)",
      "--chart-2": "oklch(0.704 0.14 182.503)",
      "--chart-3": "oklch(0.6 0.118 184.704)",
      "--chart-4": "oklch(0.511 0.096 186.391)",
      "--chart-5": "oklch(0.437 0.078 188.216)",
      "--sidebar-primary": "oklch(0.6 0.118 184.704)",
    },
    dark: {
      "--primary": "oklch(0.437 0.078 188.216)",
      "--chart-1": "oklch(0.855 0.138 181.071)",
      "--chart-2": "oklch(0.704 0.14 182.503)",
      "--chart-3": "oklch(0.6 0.118 184.704)",
      "--chart-4": "oklch(0.511 0.096 186.391)",
      "--chart-5": "oklch(0.437 0.078 188.216)",
      "--sidebar-primary": "oklch(0.704 0.14 182.503)",
      "--sidebar-primary-foreground": "oklch(0.277 0.046 192.524)",
    },
  },
  Violet: {
    root: {
      "--primary": "oklch(0.491 0.27 292.581)",
      "--chart-1": "oklch(0.811 0.111 293.571)",
      "--chart-2": "oklch(0.606 0.25 292.717)",
      "--chart-3": "oklch(0.541 0.281 293.009)",
      "--chart-4": "oklch(0.491 0.27 292.581)",
      "--chart-5": "oklch(0.432 0.232 292.759)",
      "--sidebar-primary": "oklch(0.541 0.281 293.009)",
    },
    dark: {
      "--primary": "oklch(0.432 0.232 292.759)",
      "--chart-1": "oklch(0.811 0.111 293.571)",
      "--chart-2": "oklch(0.606 0.25 292.717)",
      "--chart-3": "oklch(0.541 0.281 293.009)",
      "--chart-4": "oklch(0.491 0.27 292.581)",
      "--chart-5": "oklch(0.432 0.232 292.759)",
      "--sidebar-primary": "oklch(0.606 0.25 292.717)",
    },
  },
  Yellow: {
    root: {
      "--primary": "oklch(0.852 0.199 91.936)",
      "--primary-foreground": "oklch(0.421 0.095 57.708)",
      "--chart-1": "oklch(0.905 0.182 98.111)",
      "--chart-2": "oklch(0.795 0.184 86.047)",
      "--chart-3": "oklch(0.681 0.162 75.834)",
      "--chart-4": "oklch(0.554 0.135 66.442)",
      "--chart-5": "oklch(0.476 0.114 61.907)",
      "--sidebar-primary": "oklch(0.681 0.162 75.834)",
    },
    dark: {
      "--primary": "oklch(0.795 0.184 86.047)",
      "--primary-foreground": "oklch(0.421 0.095 57.708)",
      "--chart-1": "oklch(0.905 0.182 98.111)",
      "--chart-2": "oklch(0.795 0.184 86.047)",
      "--chart-3": "oklch(0.681 0.162 75.834)",
      "--chart-4": "oklch(0.554 0.135 66.442)",
      "--chart-5": "oklch(0.476 0.114 61.907)",
      "--sidebar-primary": "oklch(0.795 0.184 86.047)",
    },
  },
}

export function applyColorTheme(theme: string, isDark: boolean) {
  const entry = THEMES[theme] ?? THEMES.Default
  const vars = isDark ? entry.dark : entry.root
  const root = document.documentElement

  const allVars = new Set<string>()
  Object.values(THEMES).forEach(({ root: r, dark: d }) => {
    Object.keys(r).forEach((k) => allVars.add(k))
    Object.keys(d).forEach((k) => allVars.add(k))
  })
  allVars.forEach((k) => root.style.removeProperty(k))

  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
}

export function useColorTheme(theme: string, isDark: boolean) {
  useEffect(() => {
    applyColorTheme(theme, isDark)
  }, [theme, isDark])
}