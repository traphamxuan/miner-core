import { GameLoop } from './GameLoop'
import { InputProcessor, TInputRequest } from './InputProcessor'
import { InternalProcessor, TInternalRequest } from './InternalProcessor'
import { SyncProcessor } from './SyncProcessor'

export type { SyncProcessor }
export type { InternalProcessor, TInternalRequest }
export type { InputProcessor, TInputRequest }
export type { GameLoop }
export type Engine = {
  sync: SyncProcessor,
  internal: InternalProcessor,
  input: InputProcessor,
  loop: GameLoop,
}

export function createCoreEngine(): Engine {
  const internal = new InternalProcessor()
  const input = new InputProcessor()
  const sync = new SyncProcessor()
  const loop = new GameLoop(internal, input, sync)
  return {
    sync,
    internal,
    input,
    loop,
  }
}
