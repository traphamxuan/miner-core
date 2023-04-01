import { BaseEntity } from "../common/BaseEntity"
import { Resource } from "./Resource"

export class Machine extends BaseEntity {
  power: number
  production: Resource | undefined
  constructor(power: number) {
    super()
    this.power = power
  }
  setProduct = (prod: Resource | undefined) => this.production = prod
  upgrade() {}
}
