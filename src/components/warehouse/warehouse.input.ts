import { Engine, InputProcessor } from '../../core'
import { TResource } from '../../entities'
import { PlanetService } from '../planet/planet.service'
import { WarehouseService } from './warehouse.service'

export class WarehouseInputManagement {
  private identity: string
  private inputProcessor: InputProcessor
  constructor(
    engine: Engine,
    private planetService: PlanetService,
    private warehouseService: WarehouseService,
  ) {
    this.identity = `warehouse-${this.planetService.planet?.id}`
    this.inputProcessor = engine.input
  }
  get id(): string { return this.identity }

  private makeRequest<T>(func: (ok: (value: T | PromiseLike<T>) => void, failed: (reason?: Error) => void) => (err: Error | null, ts: number) => void) {
    return new Promise<T>((ok, failed) => {
      this.inputProcessor.request({ action: func(ok, failed) })
    })
  }

  requestSellResource(resource: TResource) {
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      this.warehouseService.sell(resource.base.id, ts)
      ok(undefined)
    })
  }
}
