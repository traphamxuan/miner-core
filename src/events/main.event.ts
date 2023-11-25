import { MinHeap } from "@/algo"


interface EventDispatcher {
  notify(event: TExternalEvent): void
}

interface Entitiy {
  estEvents(timestamp: number, ...args: unknown[]): TInternalEvent[]
  syncAt(timestamp: number, ...args: unknown[]): void
  update(event: TExternalEvent): void
}

export class MainEvent {
  private isContinuous: boolean
  private actions: TActionEvent[]
  private updates: TUpdateEvent[]

  constructor(
    private entities: Entitiy[],
    private dispatcher: EventDispatcher[],
    private start: (ts: number) => void,
    private stop: (ts: number) => void
  ) {
    this.isContinuous = false
    this.actions = []
    this.updates = []
  }

  private main(events: TExternalEvent[]) {
    for (const event of events) {
      this.syncAllComponents(event)
      this.processEvent(event)
    }
    setImmediate(() => events.forEach(event => this.notifyChanges(event)))
  }

  private syncAllComponents(exEvent: TExternalEvent) {
    const eventPool = new MinHeap<TInternalEvent>((o1, o2) => o1.timestamp < o2.timestamp)
    for (const entity of this.entities) {
      const events = entity.estEvents(exEvent.timestamp)
      events.forEach(ev => eventPool.add(ev))
    }

    let event = eventPool.remove()
    while (event !== null) {
      for (const entity of this.entities) {
        entity.syncAt(event.timestamp, event.id)
      }
      event = eventPool.remove()
    }
  }

  private processEvent(event: TExternalEvent) {
    for (const entity of this.entities) {
      entity.update(event)
    }
  }

  private notifyChanges(event: TExternalEvent) {
    for (const service of this.dispatcher) {
      service.notify(event)
    }
  }
}