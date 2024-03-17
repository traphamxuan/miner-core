type Position = {
  x: number
  y: number
}

type StaticObject = {
  resource: QuickAccessStore<StaticResource>
  deposit: QuickAccessStore<StaticDeposit>
  shuttle: QuickAccessStore<StaticShuttle>
  recipe: QuickAccessStore<StaticRecipe>
  machine: QuickAccessStore<StaticMachine>
}
