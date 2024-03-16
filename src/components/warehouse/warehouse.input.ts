import { BaseInputEvent } from '../../common/interfaces/BaseInputEvent'
import { Engine } from '../../core'
import { Resource } from '../../entities'
import { WarehouseInternalEvent } from './warehouse.internal'
import { WarehouseService } from './warehouse.service'

export class WarehouseInputManagement extends BaseInputEvent {
  constructor(
    engine: Engine,
    private warehouseService: WarehouseService,
    private warehouseInternal: WarehouseInternalEvent,
  ) {
    super(engine.input)
  }
  get id(): string { return this.warehouseService.id + '-input' }

  requestSellResource(sResourceId: string, amount: bigint, timestamp?: number): Promise<Resource> {
    return timestamp ? this.warehouseInternal.sellResource(sResourceId, amount, timestamp)
    : this.makeRequest((ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip requestSellResource ${sResourceId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      this.warehouseInternal.sellResource(sResourceId, amount, ts)
        .then(resource => ok(resource))
        .catch(err => failed(err))
    })
  }
}
