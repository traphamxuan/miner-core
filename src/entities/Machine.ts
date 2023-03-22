import { BaseEntity } from "../common/BaseEntity"

export class Machine extends BaseEntity {
  power: number
  constructor() {
    super()
    this.power = 1
  }
  upgrade() {}
}
