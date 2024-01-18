use crate::entities::common::Position;

impl Ore {}
pub struct Ore {
  pub srid: String,
  pub sr_name: String,
  pub ratio: f64,
}

impl RawBaseDeposit {}
pub struct RawBaseDeposit {
  pub id: String,
  pub name: String,
  pub icon: Option<String>,
  pub rate: f64,
  pub price: String,
  pub position: Position,
  pub ores: Vec<Ore>,
}

impl RawBaseShuttle {}
pub struct RawBaseShuttle {
  pub id: String,
  pub name: String,
  pub power: f64,
  pub capacity: f64,
  pub price: String,
  pub deposit: Option<String>,
}

impl RawBaseMachine {}
pub struct RawBaseMachine {
  pub id: String,
  pub name: String,
  pub power: f64,
  pub price: String,
}

impl RawBaseRecipe {}
pub struct RawBaseRecipe {
  pub id: String,
  pub name: String,
  pub cost: f64,
  pub price: String,
  pub ingredients: Vec<Ingredient>,
}

impl Ingredient {}
pub struct Ingredient {
  pub srid: String,
  pub sr_name: String,
  pub amount: String,
}

impl RawBaseProduct {}
pub struct RawBaseProduct {
  pub id: String,
  pub name: String,
  pub icon: Option<String>,
  pub category: String,
  pub value: String,
  pub weight: f64,
}

impl RawBase {}
pub struct RawBase {
  pub deposits: Vec<RawBaseDeposit>,
  pub shuttles: Vec<RawBaseShuttle>,
  pub machines: Vec<RawBaseMachine>,
  pub recipes: Vec<RawBaseRecipe>,
  pub products: Vec<RawBaseProduct>,
}
