import { Resource } from "../entities";
import { WarehouseService } from "../pool";
import { BaseEvent } from "./BaseEvent";
import { EventProcessor } from "../core";

export class WarehouseInternalEvent extends BaseEvent{
  constructor(
    event: EventProcessor,
    private warehouseService: WarehouseService,
  ) {
    super(event)
  }

  get id(): string { return this.warehouseService.id + '-internal' }

  async sellResource(sResourceId: string, amount: bigint, timestamp: number): Promise<Resource> {
    return this.makeRequest('sell-resource-' + sResourceId, timestamp, (ok, failed) => (ts, isSkip) => {
      if (isSkip) {
        failed(new Error(`Skip sellResource ${sResourceId}`))
        return -1
      }
      const resource = this.warehouseService.Resource(sResourceId)
      if (!resource) {
        failed(new Error(`Invalid resource id ${sResourceId}`))
        return -1
      }
      if (resource.syncedAt > ts) {
        failed(new Error(`Invalid timestamp ${ts} for resource ${sResourceId}`))
        return -1
      }
      this.warehouseService.sell(sResourceId, ts, amount)
      ok(resource)
      return 0
    })
  }
}
