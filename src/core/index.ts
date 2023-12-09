import { ExternalProcessor } from './ExternalProcessor'
import { GameLoop } from './GameLoop'
import { InputProcessor, TInputRequest } from './InputProcessor'
import { InternalProcessor, TInternalRequest } from './InternalProcessor'
import { SyncProcessor } from './SyncProcessor'

export type { SyncProcessor }
export type { InternalProcessor, TInternalRequest }
export type { InputProcessor, TInputRequest }
export type { GameLoop }
export type Engine = {
  external: ExternalProcessor,
  sync: SyncProcessor,
  internal: InternalProcessor,
  input: InputProcessor,
  loop: GameLoop,
}

export function createCoreEngine(): Engine {
  const external = new ExternalProcessor()
  const sync = new SyncProcessor()
  const internal = new InternalProcessor()
  const input = new InputProcessor()
  const loop = new GameLoop(external, internal, input, sync)
  return {
    external,
    sync,
    internal,
    input,
    loop,
  }
}
