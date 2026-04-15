import type { Json } from '@/types/database'

export function metaStrings(metadata: Json): Record<string, string> {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    const o = metadata as Record<string, unknown>
    const out: Record<string, string> = {}
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'string') out[k] = v
    }
    return out
  }
  return {}
}
