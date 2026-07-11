/**
 * Renders a JSON-LD <script> tag. `application/ld+json` is never executed
 * by the browser (it's inert structured data, not markup or script), so
 * this is the standard, documented exception to "avoid
 * dangerouslySetInnerHTML" — the only residual risk is a literal
 * `</script>` inside a string value breaking out early, neutralized by
 * escaping `<` to its unicode form below.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
