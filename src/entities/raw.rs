use wasm_bindgen::prelude::*;

use super::common::Position;

#[wasm_bindgen]
pub struct RawPlanet {
  id: String,
  name: String,
  money: String,
  uid: String,
  // isFactory: boolean
  startedAt: f64,
  updatedAt: String
}

#[wasm_bindgen]
pub struct RawOre {
  srid: String,
  amount: String,
}

#[wasm_bindgen]
pub struct RawDeposit {
  pid:String,
  sdid:String,
  ores:Vec<RawOre>,
  rate:f64,
  syncedAt:f64,
}

#[wasm_bindgen]
pub struct RawResourceAmount {
  srid: String,
  amount: String,
}

impl RawResourceAmount {
    fn new(srid: String, amount: String) -> RawResourceAmount {
        RawResourceAmount {
            srid,
            amount,
        }
    }
}

#[wasm_bindgen]
pub struct RawShuttle {
  pid: String,
  ssid: String,
  sdid: Option<String>,
  power: f64,
  capacity: f64,
  position: Position,
  isReturned: bool,
  load: Vec<RawResourceAmount>,
  syncedAt: f64,
}

#[wasm_bindgen]
pub struct RawResource {
  pid: String,
  srid: String,
  amount: String,
  syncedAt: f64,
}

#[wasm_bindgen]
pub struct RawRecipe {
  pid: String,
  sreid: String,
  cost: f64,
  syncedAt: f64,
}

#[wasm_bindgen]
pub struct RawMachine {
  pid: String,
  smid: String,
  sreid: Option<String>,
  progress: f64,
  isRun: bool,
  power: f64,
  syncedAt: f64,
}

#[wasm_bindgen]
pub struct GameData {
    planet: RawPlanet,
    deposits: Vec<RawDeposit>,
    shuttles: Vec<RawShuttle>,
    resources: Vec<RawResource>,
    machines: Vec<RawMachine>,
    recipes: Vec<RawRecipe>,
}
