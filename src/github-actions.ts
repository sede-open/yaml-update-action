/* eslint-disable no-console */
import { debug, info, warning, setOutput, setFailed } from '@actions/core'

export interface Actions {
  debug(message: string): void
  info(message: string): void
  warning(message: string): void
  setOutput(name: string, output: string): void
  setFailed(message: string): void
}

export class GitHubActions implements Actions {
  debug(message: string): void {
    debug(message)
  }

  info(message: string): void {
    info(message)
  }

  warning(message: string): void {
    warning(message)
  }

  setOutput(name: string, output: string): void {
    setOutput(name, output)
  }

  setFailed(message: string): void {
    setFailed(message)
  }
}

export class LogActions implements Actions {
  debug(message: string): void {
    console.info(message)
  }
  info(message: string): void {
    console.info(message)
  }

  warning(message: string): void {
    console.warn(message)
  }

  setOutput(name: string, output: string): void {
    console.log(name, output)
  }

  setFailed(message: string): void {
    console.error(message)
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export class EmptyActions implements Actions {
  debug(_message: string): void {
    // Empty
  }

  info(_message: string): void {
    // Empty
  }

  warning(_message: string): void {
    // Empty
  }

  setOutput(_name: string, _output: string): void {
    // Empty
  }

  setFailed(_message: string): void {
    // Empty
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
