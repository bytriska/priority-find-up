export type SearchKey = string | string[]
export type PriorityManifest = SearchKey[]

export interface FindOptions {
  cwd?: string
  stopDir?: string
}

export interface FoundResult {
  path: string
  priority: number
  key: string
  depth: number
}

// eslint-disable-next-line unused-imports/no-unused-vars
export function findUpAll(manifest: PriorityManifest, options?: FindOptions): FoundResult[] {
  return []
}

// eslint-disable-next-line unused-imports/no-unused-vars
export function findUp(manifest: PriorityManifest, options?: FindOptions): FoundResult | null {
  return null
}
