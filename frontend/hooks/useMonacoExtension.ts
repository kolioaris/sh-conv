import type * as Monaco from "monaco-editor"

const SHADCN_VARS = [
  "--background", "--foreground", "--card", "--card-foreground", "--popover", "--popover-foreground", "--primary", "--primary-foreground", "--secondary", "--secondary-foreground", "--muted", "--muted-foreground", "--accent", "--accent-foreground", "--destructive", "--destructive-foreground", "--border", "--input", "--ring", "--radius", "--sidebar-background", "--sidebar-foreground", "--sidebar-primary", "--sidebar-primary-foreground", "--sidebar-accent", "--sidebar-accent-foreground", "--sidebar-border", "--sidebar-ring", "--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5",
]

const SHCONV_CLASSES = [
  ".sh-conv-topbar", ".sh-conv-topbar-logo", ".sh-conv-topbar-search-btn", ".sh-conv-topbar-settings-btn", ".sh-conv-topbar-separator", ".sh-conv-footer", ".sh-conv-page", ".sh-conv-command-modal", ".sh-conv-command-input", ".sh-conv-command-item", ".sh-conv-command-group", ".sh-conv-settings-modal", ".sh-conv-settings-sidebar", ".sh-conv-settings-tab", ".sh-conv-settings-content", ".sh-conv-settings-section-title", ".sh-conv-settings-save-btn", ".sh-conv-css-editor", ".sh-conv-dropzone", ".sh-conv-dropzone-icon", ".sh-conv-dropzone-text", ".sh-conv-dropzone-btn", ".sh-conv-file-item", ".sh-conv-file-preview", ".sh-conv-file-metadata", ".sh-conv-file-delete-btn", ".sh-conv-format-select", ".sh-conv-convert-options-btn", ".sh-conv-convert-btn", ".sh-conv-options-modal", ".sh-conv-options-section-title", ".sh-conv-options-save-btn", ".sh-conv-download-title", ".sh-conv-download-description", ".sh-conv-download-url-input", ".sh-conv-download-format-select", ".sh-conv-download-quality-select", ".sh-conv-download-options-btn", ".sh-conv-download-btn", ".sh-conv-download-options-modal"
]

export function registerShadcnExtension(monaco: typeof Monaco) {
  monaco.languages.registerCompletionItemProvider("css", {
    triggerCharacters: ["-"],
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const varSuggestions = SHADCN_VARS.map((v) => ({
        label: `var(${v})`,
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: `var(${v})`,
        documentation: `shadcn/ui CSS variable: ${v}`,
        range,
      }))

      const defSuggestions = SHADCN_VARS.map((v) => ({
        label: v,
        kind: monaco.languages.CompletionItemKind.Property,
        insertText: `${v}: `,
        documentation: `Define ${v}`,
        range,
      }))

      const classSuggestions = SHCONV_CLASSES.map((c) => ({
        label: c,
        kind: monaco.languages.CompletionItemKind.Class,
        insertText: c + " {\n\t\n}",
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: `sh-conv custom class: ${c}`,
        range,
      }))

      return { suggestions: [...varSuggestions, ...defSuggestions, ...classSuggestions] }
    },
  })

  monaco.languages.registerHoverProvider("css", {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position)
      if (!word) return null
      const line = model.getLineContent(position.lineNumber)
      const match = SHADCN_VARS.find((v) => line.includes(v))
      if (!match) return null
      return {
        contents: [
          { value: `**${match}**` },
          { value: `shadcn/ui CSS variable. Current value: \`${getComputedStyle(document.documentElement).getPropertyValue(match).trim() || "not set"}\`` },
        ],
      }
    },
  })
}