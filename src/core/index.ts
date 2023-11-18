import { ExternalProcessor } from './ExternalProcessor'
import { GameLoop } from './GameLoop'
import { InputProcessor, TInputRequest } from './InputProcessor'
import { InternalProcessor, TInternalRequest } from './InternalProcessor'
import { SyncProcessor } from './SyncProcessor'

export type { SyncProcessor }
export type { InternalProcessor, TInternalRequest }
export type { InputProcessor, TInputRequest }
export type { GameLoop }

export const externalProcessor = new ExternalProcessor()
export const syncProcessor = new SyncProcessor()
export const internalProcessor = new InternalProcessor()
export const inputProcessor = new InputProcessor()
export const gameLoop = new GameLoop(externalProcessor, internalProcessor, inputProcessor, syncProcessor)
export const GlobalTick = () => GameLoop.Tick