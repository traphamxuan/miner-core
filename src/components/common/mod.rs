use crate::entities::base::RawBaseProduct;

pub struct Ore {
  pub id: String,
  pub amount: f64,
  pub base: RawBaseProduct,
}

pub struct ProductAmount {
  pub srid: String,
  pub amount: String,
  pub base: RawBaseProduct,
}
