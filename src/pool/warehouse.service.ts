import { TResource, Resource, TResourceAmount } from '../entities'
import { QuickAccessStore } from '../common/services/QuickAccessStore'
import { SubEvent } from '../common/services/SubEvent'
import { PlanetService } from './planet.service'
import { StaticService } from './static.service'

type TWarehouseAction = {
  onIncrease?: (resPackId: string, amount: bigint, resSet: TResource, ts: number) => void
  // onUpdate?: (planetId: string, resources: TResource[]) => void
  // onNewResource?: (planetId: string, resSet: TResource) => void
  // onMoneyChange?: (planetId: string, money: bigint, planet: Planet) => void
}

export class WarehouseService {
  private resources: QuickAccessStore<Resource>
  private subEvent: SubEvent<TWarehouseAction>
  constructor(
    private planetService: PlanetService,
    private sService: StaticService,
  ) {
    this.resources = new QuickAccessStore()
    this.subEvent = new SubEvent()
  }
  get id() { return `service-${this.planetService.planet?.id}` }
  Resources() { return this.resources.getStores() }
  Resource(id: string) { return this.resources.getOne(id) }

  addResource(resource: Resource): Resource {
    this.resources.add(resource, [resource.base.id, resource.base.name])
    this.resources.getStores().sort((a, b) => a.base.weight - b.base.weight)
    return resource
  }

  addNew(sResourceId: string): Resource {
    if (!this.planetService.planet) {
      throw new Error('Planet not found')
    }
    let existed = this.Resource(sResourceId)
    if (!existed) {
      const sResource = this.sService.getOne('resource', sResourceId)
      if (!sResource) {
        throw new Error(`Resource ${sResourceId} not found`)
      }
      existed = new Resource({
        pid: this.planetService.planet.id,
        srid: sResourceId,
        amount: '0',
        syncedAt: 0,
      }, sResource)
      this.addResource(existed)
    }
    return existed
  }

  reset() {
    this.subEvent = new SubEvent()
    this.resources.reset()
  }

  put(resAmounts: TResourceAmount[], timestamp: number) {
    const resources: Resource[] = []
    for (const res of resAmounts) {
      let resource = this.resources.getOne(res.base.id)
      if (!resource) {
        resource = this.addNew(res.id)
        resources.push(resource)
      }
      resources.push(resource)
    }
    resAmounts.forEach((res, idx) => {
      const resource = resources[idx]
      resource.amount += res.amount
      this.subEvent.dispatchEvent(res.base.id, 'onIncrease', res.amount, resource, timestamp)
    })
  }

  take(resAmounts: TResourceAmount[]): boolean {
    const resources: Resource[] = []
    for (const res of resAmounts) {
      const resource = this.resources.getOne(res.base.id)
      if (!resource) return false
      if (res.amount > resource.amount) {
        return false
      }
      resources.push(resource)
    }
    resAmounts.forEach((res, idx) => resources[idx].amount -= res.amount)
    return true
  }

  sell(sResourceId: string, ts: number, amount?: bigint): bigint {
    const planet = this.planetService.planet
    if (!planet) { return 0n }
    const resource = this.resources.getOne(sResourceId)
    if (!resource) { return 0n }
    const amountExist = resource.amount
    let amountToSell = amountExist
    if (typeof amount == 'bigint') {
      amountToSell = amount > amountExist ? amountExist : amount
    }
    resource.amount -= amountToSell
    const value = amountToSell * resource.base.value
    planet.money += value
    resource.syncedAt = ts
    return value
  }

  registerChange(resPackOrPlanetId: string, uId: string, action: TWarehouseAction) {
    return this.subEvent.registerChange(resPackOrPlanetId, uId, action)
  }

  unregisterChanges(resPackOrPlanetId: string, uId?: string) {
    this.subEvent.unregisterChange(resPackOrPlanetId, uId)
  }
}
