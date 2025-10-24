import { afterEach, describe, expect, test } from 'vitest'

import { debugModeStore, type DebugModeKey } from './debugModeStore'

const LOCAL_STORAGE_KEY: DebugModeKey = 'localStorage'
const SNIPPETS_KEY: DebugModeKey = 'snippets'

describe('debugModeStore', () => {
  afterEach(() => {
    debugModeStore.disableAll()
  })

  test('is disabled by default', () => {
    expect(debugModeStore.isEnabled()).toBe(false)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(false)
  })

  test('enableAll toggles every debug mode on', () => {
    debugModeStore.enableAll()

    expect(debugModeStore.isEnabled()).toBe(true)
    expect(debugModeStore.isEnabled(LOCAL_STORAGE_KEY)).toBe(true)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(true)
  })

  test('disableAll clears previously enabled flags', () => {
    debugModeStore.enableAll()
    debugModeStore.disableAll()

    expect(debugModeStore.isEnabled()).toBe(false)
    expect(debugModeStore.isEnabled(LOCAL_STORAGE_KEY)).toBe(false)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(false)
  })

  test('enableKeys tracks specific keys when store is disabled', () => {
    debugModeStore.enableKeys(SNIPPETS_KEY)

    expect(debugModeStore.isEnabled()).toBe(true)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(true)
  })

  test('enableKeys tracks additional keys when store is enabled', () => {
    debugModeStore.enableKeys(LOCAL_STORAGE_KEY)
    debugModeStore.enableKeys(SNIPPETS_KEY)

    expect(debugModeStore.isEnabled()).toBe(true)
    expect(debugModeStore.isEnabled(LOCAL_STORAGE_KEY)).toBe(true)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(true)
  })

  test('enableKeys is a no-op when all debug modes are already enabled', () => {
    debugModeStore.enableAll()
    debugModeStore.enableKeys(SNIPPETS_KEY)

    expect(debugModeStore.isEnabled()).toBe(true)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(true)
  })

  test('enableKeys works with array of keys', () => {
    debugModeStore.enableKeys([LOCAL_STORAGE_KEY, SNIPPETS_KEY])

    expect(debugModeStore.isEnabled()).toBe(true)
    expect(debugModeStore.isEnabled(LOCAL_STORAGE_KEY)).toBe(true)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(true)
  })

  test('disableKeys removes keys from the enabled set', () => {
    debugModeStore.enableAll()
    debugModeStore.disableKeys(SNIPPETS_KEY)

    expect(debugModeStore.isEnabled()).toBe(true)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(false)
  })

  test('disableKeys works with array of keys', () => {
    debugModeStore.enableAll()
    debugModeStore.disableKeys([LOCAL_STORAGE_KEY, SNIPPETS_KEY])

    expect(debugModeStore.isEnabled()).toBe(false)
    expect(debugModeStore.isEnabled(LOCAL_STORAGE_KEY)).toBe(false)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(false)
  })

  test('replaceEnabledKeys overwrites currently enabled keys', () => {
    debugModeStore.enableKeys(LOCAL_STORAGE_KEY)
    debugModeStore.replaceEnabledKeys(SNIPPETS_KEY)

    expect(debugModeStore.isEnabled()).toBe(true)
    expect(debugModeStore.isEnabled(LOCAL_STORAGE_KEY)).toBe(false)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(true)
  })

  test('replaceEnabledKeys works with array of keys', () => {
    debugModeStore.enableKeys(LOCAL_STORAGE_KEY)
    debugModeStore.replaceEnabledKeys([SNIPPETS_KEY])

    expect(debugModeStore.isEnabled()).toBe(true)
    expect(debugModeStore.isEnabled(LOCAL_STORAGE_KEY)).toBe(false)
    expect(debugModeStore.isEnabled(SNIPPETS_KEY)).toBe(true)
  })
})
