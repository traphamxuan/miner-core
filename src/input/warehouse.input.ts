import { BaseInputEvent } from './BaseInputEvent'
import type { Resource } from '../entities'
import { WarehouseInternalEvent } from '../event'
import { InputProcessor } from '../core'

export class WarehouseInputManagement extends BaseInputEvent {
  constructor(
    input: InputProcessor,
    private warehouseInternal: WarehouseInternalEvent,
  ) {
    super(input)
  }

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
