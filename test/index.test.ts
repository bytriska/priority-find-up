import { describe, expect, it } from 'vitest'
import { findUp, findUpAll } from '../src'
import { fixtures } from './utils'

const startDir = fixtures('workspace', 'packages', 'backend')

describe('findTiered', () => {
  it('should prioritize files based on array order in the same directory', () => {
    const keys = ['local.env', 'temp.txt']
    const results = findUpAll(keys, { cwd: startDir, stopDir: fixtures() })

    expect(results).toHaveLength(2)

    expect(results[0]).toMatchObject({
      key: 'local.env',
      priority: 0,
      depth: 0,
    })
    expect(results[0].path).toContain('local.env')

    expect(results[1].priority).toBe(1)
    expect(results[1].path).toContain('temp.txt')
  })

  it('should find files in parent directories', () => {
    const keys = ['non-existent.file', 'package.json']
    const results = findUpAll(keys, { cwd: startDir, stopDir: fixtures() })

    expect(results).toHaveLength(1)

    expect(results[0].path).toContain('package.json')
    expect(results[0].depth).toBeGreaterThan(0)
    expect(results[0].priority).toBe(1)
  })

  it('should handle nested array keys as a single priority tier', () => {
    const keys = ['non-existent.file', ['config.json', 'local.env']]
    const results = findUpAll(keys, { cwd: startDir, stopDir: fixtures() })

    expect(results).toHaveLength(2)

    expect(results[0].path).toContain('local.env')
    expect(results[0].priority).toBe(1)
  })

  it('should stop traversing at stopDir', () => {
    const keys = ['config.json']
    const stopDir = fixtures('workspace')

    const results = findUpAll(keys, { cwd: startDir, stopDir })

    expect(results).toHaveLength(0)
  })

  it('should sort result by priority score first, then depth', () => {
    const keys = ['config.json', 'local.env']
    const results = findUpAll(keys, { cwd: startDir, stopDir: fixtures() })

    expect(results).toHaveLength(2)

    expect(results[0].path).toContain('config.json')
    expect(results[0].priority).toBe(0)

    expect(results[1].path).toContain('local.env')
    expect(results[1].priority).toBe(1)
  })
})

describe('findOne', () => {
  it('should prioritize files based on array order in the same directory', () => {
    const keys = ['local.env', 'temp.txt']
    const result = findUp(keys, { cwd: startDir, stopDir: fixtures() })

    expect(result).toMatchObject({
      key: 'local.env',
      priority: 0,
      depth: 0,
    })
    expect(result?.path).toContain('local.env')
  })

  it('should find files in parent directories', () => {
    const keys = ['non-existent.file', 'package.json']
    const result = findUp(keys, { cwd: startDir, stopDir: fixtures() })

    expect(result?.path).toContain('package.json')
    expect(result?.depth).toBeGreaterThan(0)
    expect(result?.priority).toBe(1)
  })

  it('should handle nested array keys as a single priority tier', () => {
    const keys = ['non-existent.file', ['config.json', 'local.env']]
    const result = findUp(keys, { cwd: startDir, stopDir: fixtures() })

    expect(result?.path).toContain('local.env')
    expect(result?.priority).toBe(1)
  })

  it('should stop traversing at stopDir', () => {
    const keys = ['config.json']
    const stopDir = fixtures('workspace')

    const result = findUp(keys, { cwd: startDir, stopDir })

    expect(result).toBeNull()
  })

  it('should sort result by priority score first, then depth', () => {
    const keys = ['config.json', 'local.env']
    const result = findUp(keys, { cwd: startDir, stopDir: fixtures() })

    expect(result?.path).toContain('config.json')
    expect(result?.priority).toBe(0)
  })
})
