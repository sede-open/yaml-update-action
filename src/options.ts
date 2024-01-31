import {getInput, getBooleanInput, warning, setFailed} from '@actions/core'
import {env} from 'process'
import {convertValue, parseChanges} from './helper'
import {Committer, Changes, Method, Format, QuotingType} from './types'

export interface Options {
  valueFile: string
  propertyPath: string
  value: string
  token: string
  commitChange: boolean
  updateFile: boolean
  branch: string
  force: boolean
  masterBranchName: string
  message: string
  title: string
  description: string
  labels: string[]
  reviewers: string[]
  teamReviewers: string[]
  assignees: string[]
  targetBranch: string
  repository: string
  githubAPI: string
  createPR: boolean
  workDir: string
  committer: Committer
  changes: Changes
  format: Format
  method: Method
  noCompatMode: boolean
  quotingType?: QuotingType
}

export class GitHubOptions implements Options {
  get valueFile(): string {
    return getInput('valueFile')
  }

  get propertyPath(): string {
    return getInput('propertyPath')
  }

  get value(): string {
    return getInput('value')
  }

  get branch(): string {
    return getInput('branch')
  }

  get force(): boolean {
    return getBooleanInput('force')
  }

  get commitChange(): boolean {
    return getBooleanInput('commitChange')
  }

  get updateFile(): boolean {
    return getBooleanInput('updateFile')
  }

  get targetBranch(): string {
    return getInput('targetBranch')
  }

  get repository(): string {
    return getInput('repository')
  }

  get githubAPI(): string {
    return getInput('githubAPI')
  }

  get createPR(): boolean {
    return getBooleanInput('createPR')
  }

  get noCompatMode(): boolean {
    return getBooleanInput('noCompatMode')
  }

  get quotingType(): QuotingType | undefined {
    const quotingType = getInput('quotingType')

    return ['"', "'"].includes(quotingType)
      ? (quotingType as QuotingType)
      : undefined
  }

  get token(): string {
    return getInput('token')
  }

  get message(): string {
    return getInput('message')
  }

  get title(): string {
    return getInput('title')
  }

  get description(): string {
    return getInput('description')
  }

  get labels(): string[] {
    if (!getInput('labels')) {
      return []
    }

    return getInput('labels')
      .split(',')
      .map(label => label.trim())
      .filter(label => !!label)
  }

  get reviewers(): string[] {
    if (!getInput('reviewers')) {
      return []
    }

    return getInput('reviewers')
      .split(',')
      .map(value => value.trim())
      .filter(value => !!value)
  }

  get teamReviewers(): string[] {
    if (!getInput('teamReviewers')) {
      return []
    }

    return getInput('teamReviewers')
      .split(',')
      .map(value => value.trim())
      .filter(value => !!value)
  }

  get assignees(): string[] {
    if (!getInput('assignees')) {
      return []
    }

    return getInput('assignees')
      .split(',')
      .map(value => value.trim())
      .filter(value => !!value)
  }

  get workDir(): string {
    return getInput('workDir')
  }

  get masterBranchName(): string {
    return getInput('masterBranchName')
  }

  get committer(): Committer {
    return {
      name: getInput('commitUserName'),
      email: getInput('commitUserEmail')
    }
  }

  get changes(): Changes {
    let changes: Changes = {}
    if (this.valueFile && this.propertyPath) {
      let value: string | number | boolean = this.value

      try {
        value = convertValue(value)
      } catch {
        warning(`exception while trying to convert value '${this.value}'`)
      }

      changes[this.valueFile] = {
        [this.propertyPath]: value
      }
    }

    changes = parseChanges(changes, this.valueFile, getInput('changes'))
    if (Object.keys(changes).length === 0) {
      setFailed('No changes to update detected')
    }

    return changes
  }

  get method(): Method {
    const method = (getInput('method') || '').toLowerCase() as Method

    if (
      [Method.CreateOrUpdate, Method.Create, Method.Update].includes(method)
    ) {
      return method
    }

    return Method.CreateOrUpdate
  }

  get format(): Format {
    const format = (getInput('format') || '').toLowerCase() as Format

    if ([Format.YAML, Format.JSON, Format.UNKNOWN].includes(format)) {
      return format
    }

    return Format.UNKNOWN
  }
}

export class EnvOptions implements Options {
  get valueFile(): string {
    return env.VALUE_FILE || ''
  }

  get propertyPath(): string {
    return env.VALUE_PATH || ''
  }

  get value(): string {
    return env.VALUE || ''
  }

  get branch(): string {
    return env.BRANCH || ''
  }

  get masterBranchName(): string {
    return env.MASTER_BRANCH_NAME || ''
  }

  get force(): boolean {
    return env.FORCE === 'true'
  }

  get commitChange(): boolean {
    return env.COMMIT_CHANGE === 'true'
  }

  get updateFile(): boolean {
    return env.UPDATE_FILE === 'true'
  }

  get targetBranch(): string {
    return env.TARGET_BRANCH || ''
  }

  get token(): string {
    return env.TOKEN || ''
  }

  get createPR(): boolean {
    return env.CREATE_PR === 'true'
  }

  get noCompatMode(): boolean {
    return env.NO_COMPAT_MODE === 'true'
  }

  get quotingType(): QuotingType | undefined {
    const quotingType = env.QUOTING_TYPE || ''

    return ['"', "'"].includes(quotingType)
      ? (quotingType as QuotingType)
      : undefined
  }

  get message(): string {
    return env.MESSAGE || ''
  }

  get title(): string {
    return env.TITLE || ''
  }

  get description(): string {
    return env.DESCRIPTION || ''
  }

  get labels(): string[] {
    return (env.LABELS || '')
      .split(',')
      .map(label => label.trim())
      .filter(label => !!label)
  }

  get reviewers(): string[] {
    return (env.REVIEWERS || '')
      .split(',')
      .map(label => label.trim())
      .filter(label => !!label)
  }

  get teamReviewers(): string[] {
    return (env.TEAM_REVIEWERS || '')
      .split(',')
      .map(label => label.trim())
      .filter(label => !!label)
  }

  get assignees(): string[] {
    return (env.ASSIGNEES || '')
      .split(',')
      .map(label => label.trim())
      .filter(label => !!label)
  }

  get repository(): string {
    return env.REPOSITORY || ''
  }

  get githubAPI(): string {
    return env.GITHUB_API || 'https://api.github.com'
  }

  get workDir(): string {
    return env.WORK_DIR || '.'
  }

  get committer(): Committer {
    return {
      name: env.COMMIT_USER_NAME || '',
      email: env.COMMIT_USER_EMAIL || ''
    }
  }

  get changes(): Changes {
    const changes: Changes = {}
    if (this.valueFile && this.propertyPath) {
      let value: string | number | boolean = this.value

      try {
        value = convertValue(value)
      } catch {
        warning(`exception while trying to convert value '${this.value}'`)
      }

      changes[this.valueFile] = {
        [this.propertyPath]: value
      }
    }

    return parseChanges(changes, this.valueFile, env.CHANGES || '')
  }

  get method(): Method {
    const method = (env.METHOD || '').toLowerCase() as Method

    if ([Method.CreateOrUpdate, Method.Create, Method.Update].includes(method)) {
      return env.METHOD as Method
    }

    return Method.CreateOrUpdate
  }

  get format(): Format {
    const format = (env.FORMAT || '').toLowerCase() as Format

    if ([Format.YAML, Format.JSON, Format.UNKNOWN].includes(format)) {
      return format
    }

    return Format.UNKNOWN
  }
}
