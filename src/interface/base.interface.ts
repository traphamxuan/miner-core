export interface BaseInterface<Raw> {
  getMany(planetId: string): Promise<Raw[]>
  create(planetId: string, staticId: string): Promise<Raw>
  save(planetId: string, data: Raw[]): Promise<Raw[]>
}