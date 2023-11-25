type TInternalEvent = {
  eventType: 'shuttle' | 'machine'
  id: string
  timestamp: number
}

type TExternalEvent = {
  action: 'abc'
  timestamp: number
}

type TBaseEvent = {
  name: string
  timestamp: number
}

type TActionEvent = TBaseEvent

type TUpdateEvent = TBaseEvent
