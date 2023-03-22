import { Factory } from "./Factory"
import { Transporter } from "./Transporter"
import { Warehouse } from "./Warehouse"

export class Planet {
  private constructor(public warehouse: Warehouse, public factory: Factory, public transporter: Transporter) {}

  static register() {
    const warehouse = new Warehouse()
    const factory = new Factory(warehouse)
    const transporter = new Transporter(warehouse)

    transporter.addMine()

    return new Planet(warehouse, factory, transporter)
  }
}
