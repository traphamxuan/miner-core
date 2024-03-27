export class QuickAccessStore<T> {
  private oData: Record<string, T>
  private aData: T[]
  constructor() {
    this.oData = {}
    this.aData = []
  }

  get length(): number { return this.aData.length }
  get Type(): T { return this.aData[0] }

  reset() { this.oData = {}; this.aData = [] }

  add(data: T, keys: string[] = []) {
    keys.forEach(key => this.oData[key] = data)
    this.aData.push(data)
  }
  getStores(): T[] { return this.aData }
  getOne(idOrKey: string): T | undefined { return this.oData[idOrKey] }

}
