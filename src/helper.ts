import YAML from 'js-yaml'
import { warning } from '@actions/core'
import { Changes } from './types'

type ConvertValueUnionType = string | number | boolean
export const convertValue = (value: string): ConvertValueUnionType => {
  if (!value.startsWith('!!')) {
    return value
  }

  const result = YAML.load(`- ${value}`) as [string | number | boolean]

  return result[0]
}

export const parseChanges = (
  changes: Changes,
  valueFile: string,
  changesString: string
): Changes => {
  if (!changesString) {
    return changes
  }

  let input = null
  try {
    input = JSON.parse(changesString) || {}
  } catch {
    warning(`failed to parse JSON: ${changesString}`)
    return changes
  }

  if (!input || typeof input != 'object') {
    return changes
  }

  if (valueFile && !(valueFile in changes)) {
    changes[valueFile] = {}
  }

  for (const [key, item] of Object.entries(input)) {
    if (typeof item != 'object') {
      changes[valueFile][key] = item as string | number | boolean
      continue
    }

    changes[key] = {
      ...changes[key],
      ...item
    }
  }

  return changes
}
