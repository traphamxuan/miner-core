use crate::entities::base::{RawBaseProduct, RawBaseDeposit, RawBaseShuttle, RawBaseMachine, RawBaseRecipe, RawBase};
use crate::dsa::quick_access::QuickAccess;

pub struct Base {
  products: QuickAccess<RawBaseProduct>,
  deposits: QuickAccess<RawBaseDeposit>,
  shuttles: QuickAccess<RawBaseShuttle>,
  machines: QuickAccess<RawBaseMachine>,
  recipes: QuickAccess<RawBaseRecipe>,
}

enum Type {
  Product,
  Deposit,
  Shuttle,
  Machine,
  Recipe,
}

impl Base {
  pub fn new() -> Base {
    Base {
      products: QuickAccess::new(),
      deposits: QuickAccess::new(),
      shuttles: QuickAccess::new(),
      machines: QuickAccess::new(),
      recipes: QuickAccess::new(),
    }
  }
  pub fn load(&mut self, base_data: RawBase) {
    self.products.init(base_data.products, |item| vec![item.id.clone(), item.name.clone()]);
    self.deposits.init(base_data.deposits, |item| vec![item.id.clone(), item.name.clone()]);
    self.shuttles.init(base_data.shuttles, |item| vec![item.id.clone(), item.name.clone()]);
    self.machines.init(base_data.machines, |item| vec![item.id.clone(), item.name.clone()]);
    self.recipes.init(base_data.recipes, |item| vec![item.id.clone(), item.name.clone()]);
  }

  pub fn reset(&mut self) {
    self.products.reset();
    self.deposits.reset();
    self.shuttles.reset();
    self.machines.reset();
    self.recipes.reset();
  }

  pub fn get_product(&self, key: &str) -> Option<&RawBaseProduct> {
    self.products.get(key)
  }
  pub fn get_deposit(&self, key: &str) -> Option<&RawBaseDeposit> {
    self.deposits.get(key)
  }
  pub fn get_shuttle(&self, key: &str) -> Option<&RawBaseShuttle> {
    self.shuttles.get(key)
  }
  pub fn get_machine(&self, key: &str) -> Option<&RawBaseMachine> {
    self.machines.get(key)
  }
  pub fn get_recipe(&self, key: &str) -> Option<&RawBaseRecipe> {
    self.recipes.get(key)
  }
}
