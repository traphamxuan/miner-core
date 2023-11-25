import { inputProcessor } from '../../core'
import { TResource } from '../../entities'
import { PlanetService } from '../planet/planet.service'
import { WarehouseService } from './warehouse.service'

export class WarehouseInputManagement {
  private identity: string
  constructor(
    private planetService: PlanetService,
    private warehouseService: WarehouseService,
  ) {
    this.identity = `warehouse-${this.planetService.planet?.id}`
  }
  get id(): string { return this.identity }

  private makeRequest<T>(func: (ok: (value: T | PromiseLike<T>) => void, failed: (reason?: Error) => void) => (err: Error | null, ts: number) => void) {
    return new Promise<T>((ok, failed) => {
      inputProcessor.request({ action: func(ok, failed) })
    })
  }

  requestSellResource(resource: TResource) {
    return this.makeRequest((ok, failed) => (err, ts) => {
      if (err) {
        failed(err)
        return
      }
      this.warehouseService.sell(resource.id, ts)
      ok(undefined)
    })
  }
}
