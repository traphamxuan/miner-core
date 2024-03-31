type TRenderAction = {
  onSync: (id: string, ts: number) => void
}

interface SyncService {
  id: string
  sync(ts: number): void
}

type EventUpdateFn = (ts: number, isSkip: boolean) => number

type TEventRequest = {
  id: string
  // key: string
  // data: object
  ts: number
  nonce: number
  isDone: boolean
  type: 'oneshot' | 'continuous'
  update: EventUpdateFn
}

type TInputRequest<T> = {
  // id: string
  // key: string
  // data: T
  isDisable?: boolean
  action: (err: Error | null, ts: number, isSkip: boolean) => T
  submit?: (id: string, data: T) => void
  // callback?: <T>(result: T) => void
}

