import { Resource } from "../../entities";
import { WarehouseService } from "./warehouse.service";
import { BaseInternalEvent } from "../../common/interfaces/BaseInternalEvent";
import type { Engine } from "../../core";

export class WarehouseInternalEvent extends BaseInternalEvent{
  constructor(
    engine: Engine,
    private warehouseService: WarehouseService,
  ) {
    super(engine.internal)
  }

  get id(): string { return this.warehouseService.id + '-internal' }

  async sellResource(sResourceId: string, amount: bigint, timestamp: number): Promise<Resource> {
    return this.makeRequest('sell-resource-' + sResourceId, timestamp, (ok, failed) => (err, ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip sellResource ${sResourceId}`))
        return
      }
      if (err) {
        failed(err)
        return
      }
      const resource = this.warehouseService.Resource(sResourceId)
      if (!resource) {
        failed(new Error(`Invalid resource id ${sResourceId}`))
        return
      }
      ts = ts < timestamp ? timestamp : ts
      this.warehouseService.sell(sResourceId, ts, amount)
      ok(resource)
    })
  }
}
