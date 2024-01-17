use crate::entities::base::RawBaseResource;


pub struct ResourceAmount {
  pub srid: String,
  pub amount: String,
  pub base: RawBaseResource,
}
