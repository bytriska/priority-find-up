# @bytriska/priority-find-up

**Find files by walking up parent directories and resolving them based on an ordered priority manifest.**

Unlike conventional `find-up` utilities that stop at the first file they encounter (proximity-based), `@bytriska/priority-find-up` prioritizes **manifest order** over **location**. It ensures that higher-priority files (e.g., a production config) are discovered first, even if a lower-priority file exists closer to your current working directory.

## ✨ Features

- 🎯 **Priority-First Resolution**: Respects the order of your manifest over directory proximity.
- 🌊 **Waterfall Traversal**: Leverages `AsyncGenerators` for memory-efficient and performant file discovery.
- 📦 **Tiered Grouping**: Supports nested arrays to treat multiple file variations as a single priority tier.
- 🛡️ **Boundary Control**: Use `boundaryDir` to prevent the search from leaking outside of your project or workspace root.
- 🚀 **Zero Dependencies**: Built natively using `node:fs/promises`.

## 📦 Installation

```bash
npm install @bytriska/priority-find-up

```

## 💡 Concept: Priority vs. Proximity

Standard utilities find the **nearest** file. This library finds the **most important** file based on your manifest order.

### The Scenario

Imagine searching from `/project/apps/api` with this structure:

```text
/project
├── config.prod.json       # Tier 0 (High Priority)
└── /apps/api
    └── config.json        # Tier 1 (Lower Priority)

```

### The Comparison

#### ❌ Standard `find-up` (Proximity-based)

Stops at the first match it sees in the current directory.

```typescript
const result = await findUp(['config.prod.json', 'config.json'])
// Returns: "/project/apps/api/config.json"
```

#### ✅ `@bytriska/priority-find-up` (Priority-based)

Exhausts the search for higher tiers before looking for lower tiers.

```typescript
const result = await resolveOne(['config.prod.json', 'config.json'])
// Returns: "/project/config.prod.json"
```

**Result:** Even though `config.json` was closer, `resolveOne` successfully prioritizes the production config located in the parent directory.

## 🚀 Usage

### `resolveOne`

Finds the single best match according to your manifest hierarchy.

```typescript
import { resolveOne } from '@bytriska/priority-find-up'

const result = await resolveOne(['config.prod.json', 'config.json'], { cwd: process.cwd() })

if (result) {
  console.log(`Path: ${result.path}`)
  console.log(`Tier: ${result.priority}`) // 0 for prod, 1 for standard
}
```

### `resolveAll`

Finds all matching files across all directories, sorted by your priority manifest.

```typescript
import { resolveAll } from '@bytriska/priority-find-up'

const entries = await resolveAll(['local.env', ['.env.production', '.env']])

// result will contain all found files, ordered by priority tiers.
```

## 🛠 API Reference

### `resolveOne(manifest, options)` / `resolveAll(manifest, options)`

#### `manifest: ResolutionManifest`

An array of strings or nested arrays representing your search tiers.
`type ResolutionManifest = (string | string[])[]`

#### `options: ResolveOptions`

| Option        | Type     | Default         | Description                                      |
| ------------- | -------- | --------------- | ------------------------------------------------ |
| `cwd`         | `string` | `process.cwd()` | The directory to start searching from.           |
| `boundaryDir` | `string` | System Root     | The directory where the upward search must stop. |

### `ResolutionEntry`

The object returned upon a successful match:

- `path`: The absolute path to the file.
- `priority`: The index of the candidate in your manifest.
- `identifier`: The specific filename that triggered the match.
- `distance`: The number of directory levels jumped from `cwd`.

## 📄 License

MIT © [Triska](https://github.com/bytriska)
