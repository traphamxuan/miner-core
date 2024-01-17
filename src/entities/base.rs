use wasm_bindgen::prelude::*;
use crate::entities::common::Position;

#[wasm_bindgen]
pub struct Ore {
  srid: String,
  srName: String,
  pub ratio: f64,
}

#[wasm_bindgen]
pub struct RawBaseDeposit {
  id: String,
  name: String,
  icon: Option<String>,
  rate: f64,
  price: String,
  position: Position,
  ores: Vec<Ore>,
}

impl RawBaseDeposit {
    pub fn find_ore(&self, ore_id: &str) -> Option<&Ore> {
        self.ores.iter().find(|o| o.srid == ore_id)
    }
    pub fn len_ores(&self) -> usize {
        self.ores.len()
    }
}

#[wasm_bindgen]
pub struct RawBaseShuttle {
  id: String,
  name: String,
  power: f64,
  capacity: f64,
  price: String,
  deposit: Option<String>,
}

#[wasm_bindgen]
pub struct RawBaseMachine {
  id: String,
  name: String,
  power: f64,
  price: String,
}

#[wasm_bindgen]
pub struct RawBaseRecipe {
  id: String,
  name: String,
  cost: f64,
  price: String,
  ingredients: Vec<Ingredient>,
}

#[wasm_bindgen]
pub struct Ingredient {
  srid: String,
  srName: String,
  amount: String,
}

#[wasm_bindgen]
pub struct RawBaseResource {
  id: String,
  name: String,
  icon: Option<String>,
  category: String,
  value: String,
  weight: f64,
}

#[wasm_bindgen]
pub struct RawBase {
  deposits: Vec<RawBaseDeposit>,
  shuttles: Vec<RawBaseShuttle>,
  machines: Vec<RawBaseMachine>,
  recipes: Vec<RawBaseRecipe>,
  resources: Vec<RawBaseResource>,
}
