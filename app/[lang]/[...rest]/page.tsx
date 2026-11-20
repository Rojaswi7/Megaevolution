// Anything that matches no route ends here and renders the 404 page for its locale.
import { notFound } from 'next/navigation'
export const dynamicParams = true
export function generateStaticParams() { return [] }
export default function CatchAll() { notFound() }
