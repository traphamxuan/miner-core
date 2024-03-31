import { EventProcessor } from "./event"
import { InputProcessor } from "./input"
import { Loop } from "./loop"
import { SyncProcessor } from "./sync"

export type Engine = {
  loop: Loop
  input: InputProcessor
  event: EventProcessor
  sync: SyncProcessor
}

export function createEngine(): Engine {
  const input = new InputProcessor()
  const event = new EventProcessor()
  const sync = new SyncProcessor()
  const loop = new Loop(input, event, sync)

  return { loop, input, event, sync }
}

export type { InputProcessor, EventProcessor, SyncProcessor }