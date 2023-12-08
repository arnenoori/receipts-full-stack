export type MutableCSSProperties = {
  -readonly [K in keyof React.CSSProperties]: React.CSSProperties[K]
}
