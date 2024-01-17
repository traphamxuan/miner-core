use crate::{components::common::{ore::Ore, resource_amount::ResourceAmount}, entities::base::RawBaseDeposit};

struct Deposit {
  planet_id     :String,
  ore_storages :Vec<Ore>,
  rate        :f64,
  synced_at   :f64,
  base       : RawBaseDeposit,
  total_ores   : f64,
}

fn sync(deposit: &mut Deposit, ts: f64) {
  if ts <= deposit.synced_at {
      return;
  }
  let time_diff = (ts - deposit.synced_at) as f64 / 1000.0;
  let mut total_ores = 0.0;
  for ore in &mut deposit.ore_storages {
      if let Some(b_ore) = deposit.base.find_ore(&ore.id) {
          let changes = time_diff * b_ore.ratio * deposit.rate / 100.0;
          ore.amount += changes;
          total_ores += changes;
      }
    }
  deposit.total_ores += total_ores;
  deposit.synced_at = ts;
}

fn withdraw_ores(deposit: &mut Deposit, capacity: f64) -> Vec<ResourceAmount> {
  let mut result: Vec<ResourceAmount> = Vec::new();
  let mut capacity = capacity;
  for i in 0..deposit.base.len_ores() {
      if capacity <= 0.0 {
          break;
      }
      let ore_at_ts = &mut deposit.ore_storages[i];
      let amount = ore_at_ts.amount.floor() as i64;
      let resource = ResourceAmount {
          srid: ore_at_ts.id.clone(),
          amount: 0.into(),
          base: ore_at_ts.base.clone(),
      };
      if capacity > ore_at_ts.amount {
          resource.amount = amount.into();
          capacity -= amount as f64;
          ore_at_ts.amount -= amount as f64;
      } else if capacity > 0.0 {
          resource.amount = capacity as i64.into();
          ore_at_ts.amount -= capacity;
          capacity = 0.0;
      }
      deposit.total_ores -= resource.amount as f64;
      result.push(resource);
  }
  result
}