use super::common::Position;

pub struct RawPlanet {
  pub id: String,
  pub name: String,
  pub money: String,
  pub uid: String,
  pub started_at: f64,
  pub updated_at: String
}

pub struct RawOre {
  pub srid: String,
  pub amount: String,
}

pub struct RawDeposit {
  pub pid: String,
  pub sdid: String,
  pub ores: Vec<RawOre>,
  pub rate: f64,
  pub synced_at: f64,
}

pub struct RawProductAmount {
  pub srid: String,
  pub amount: String,
}

pub struct RawShuttle {
  pub pid: String,
  pub ssid: String,
  pub sdid: Option<String>,
  pub power: f64,
  pub capacity: f64,
  pub position: Position,
  pub is_returned: bool,
  pub load: Vec<RawProductAmount>,
  pub synced_at: f64,
}

pub struct RawProduct {
  pub pid: String,
  pub srid: String,
  pub amount: String,
  pub synced_at: f64,
}

pub struct RawRecipe {
  pub pid: String,
  pub sreid: String,
  pub cost: f64,
  pub synced_at: f64,
}

pub struct RawMachine {
  pub pid: String,
  pub smid: String,
  pub sreid: Option<String>,
  pub progress: f64,
  pub is_run: bool,
  pub power: f64,
  pub synced_at: f64,
}

pub struct RawGameData {
    pub planet: RawPlanet,
    pub deposits: Vec<RawDeposit>,
    pub shuttles: Vec<RawShuttle>,
    pub products: Vec<RawProduct>,
    pub machines: Vec<RawMachine>,
    pub recipes: Vec<RawRecipe>,
}
