use std::ptr::NonNull;

use crate::{components::common::{Ore, ProductAmount}, entities::{base::RawBaseDeposit, raw::RawDeposit}};

struct Deposit {
  planet_id     :String,
  ore_storages :Vec<Ore>,
  rate        :f64,
  synced_at   :f64,
  base       : RawBaseDeposit,
  total_ores   : f64,
}

impl Deposit {
  fn sync(&mut self, ts: f64) {
    if ts <= self.synced_at {
        return;
    }
    let time_diff = (ts - self.synced_at) / 1000.0;
    let mut total_ores = 0.0;
    for ore in &mut self.ore_storages {
      let mut bore: Option<&crate::entities::base::Ore> = None;
      for b_ore in &self.base.ores {
        if ore.id == b_ore.srid {
          bore = Some(b_ore);
          break;
        }
      }
      if let Some(bore) = bore {
        let changes = time_diff * bore.ratio * self.rate / 100.0;
        ore.amount += changes;
        total_ores += changes;
      }

    }
    self.total_ores += total_ores;
    self.synced_at = ts;
  }

  fn withdraw_ores(deposit: &mut Deposit, capacity: f64) -> Vec<ProductAmount> {
    let mut result: Vec<ProductAmount> = Vec::new();
    let mut capacity = capacity;
    for i in 0..deposit.base.ores.len() {
        if capacity <= 0.0 {
            break;
        }
        let ore_at_ts = &mut deposit.ore_storages[i];
        let amount = ore_at_ts.amount.floor() as i64;
        // let product = ProductAmount {
        //     srid: ore_at_ts.id.clone(),
        //     amount: 0.into(),
        //     // base: ore_at_ts.base.clone(),
        // };
        if capacity > ore_at_ts.amount {
            // product.amount = amount.into();
            // capacity -= amount as f64;
            // ore_at_ts.amount -= amount as f64;
        } else if capacity > 0.0 {
            // product.amount = capacity as i64.into();
            ore_at_ts.amount -= capacity;
            capacity = 0.0;
        }
        // deposit.total_ores -= product.amount as f64;
        // result.push(product);
    }
    result
  }
}