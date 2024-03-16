import { Deposit, Shuttle, TResource, TResourceAmount } from "../../entities";
import { QuickAccessStore } from "../../common/services/QuickAccessStore";
import { WarehouseService } from "../warehouse";
import type { StaticShuttle, StaticDeposit } from "../../entities/static";
import { PlanetService } from "../planet/planet.service";

export class MinerService {

  private deposits: QuickAccessStore<Deposit>
  private shuttles: QuickAccessStore<Shuttle>

  constructor(
    private planetService: PlanetService,
    private warehouseService: WarehouseService,
  ) {
    this.deposits = new QuickAccessStore()
    this.shuttles = new QuickAccessStore()
  }
  get id() { return `miner-${this.planetService.planet?.id}` }
  Deposits() { return this.deposits.getStores() }
  Deposit(id: string) { return this.deposits.getOne(id) }
  Shuttles() { return this.shuttles.getStores() }
  Shuttle(id: string) { return this.shuttles.getOne(id) }

  addDeposit(deposit: Deposit): Deposit {
    this.deposits.add(deposit, [deposit.base.id, deposit.base.name])
    return deposit
  }

  addShuttle(shuttle: Shuttle): Shuttle {
    this.shuttles.add(shuttle, [shuttle.base.id, shuttle.base.name])
    return shuttle
  }

  reset() {
    this.shuttles.reset()
    this.deposits.reset()
  }

  sync(ts: number) {
    this.Deposits().forEach(deposit => deposit.sync(ts))
    this.Shuttles().forEach(shuttle => shuttle.sync(ts))
  }

  unloadShuttleResources(shuttle: Shuttle): TResourceAmount[] {
    if (!shuttle.deposit) {
      return []
    }
    const result = shuttle.load
    this.warehouseService.put(result)
    // result.forEach(res => ((res.amount > 0) && this.warehouseService.put(res)))
    shuttle.load = []
    shuttle.position = 0
    shuttle.isReturned = false
    return result
  }

  loadShuttleResources(shuttle: Shuttle): TResourceAmount[] {
    if (!shuttle.deposit) {
      return []
    }
    const deposit = shuttle.deposit
    shuttle.load = deposit.withdrawOres(shuttle.capacity)
    shuttle.position = deposit.base.position.y
    shuttle.isReturned = true
    return shuttle.load
  }

  addNewDeposit(sDeposit: StaticDeposit, ts: number): Deposit | Error {
    const planet = this.planetService.planet
    if (!planet) {
      return new Error('No planet available')
    }

    let deposit = this.Deposit(sDeposit.id)
    if (!deposit) {

      if (!planet.checkMoney(sDeposit.price)) {
        return new Error(`Not enough money ${planet.money} < ${sDeposit.price}`)
      }
      planet.withdrawMoney(sDeposit.price)
      deposit = Deposit.initFromStatic(planet.id, sDeposit, ts)

      this.addDeposit(deposit)
      deposit.oreStorages.map(ore => {
        this.warehouseService.put([{
          id: ore.base.id,
          amount: 0n,
          base: ore.base,
        }])
      })
    }
    return deposit
  }

  addNewShuttle(sShuttle: StaticShuttle, ts: number): Shuttle | Error {
    const planet = this.planetService.planet
    if (!planet) {
      return new Error('No planet available')
    }

    let shuttle = this.Shuttle(sShuttle.id)
    if (!shuttle) {
      shuttle = Shuttle.initFromStatic(planet.id, sShuttle, ts)
      this.addShuttle(shuttle)
    }

    return shuttle
  }
}
