import { BaseEntity } from "../common/BaseEntity"

export type TAccelerator = {
  value: number
  cost: number
}

export class Accelerator extends BaseEntity {
  constructor(public value: number, public cost: number) {
    super()
  }
}
