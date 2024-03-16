export class QuickAccessStore<T> {
  private oData: Record<string, T>
  aData: T[]
  constructor() {
    this.oData = {}
    this.aData = []
  }

  get length(): number { return this.aData.length }

  reset() { this.oData = {}; this.aData = [] }

  add(data: T, keys: string[] = []) {
    keys.forEach(key => this.oData[key] = data)
    this.aData.push(data)
  }
  replaceKey(oKey: string, nKey: string): T | undefined {
    const data = this.oData[oKey]
    if (!data) return undefined
    delete this.oData[oKey]
    this.oData[nKey] = data
    return data
  }
  getStores(): T[] { return this.aData }
  getOne(idOrKey: string): T | undefined { return this.oData[idOrKey] }

}
