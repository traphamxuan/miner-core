use std::collections::HashMap;

pub struct QuickAccess<T> {
  data: Vec<T>,
  hash: HashMap<String, usize>,
}

impl<T> QuickAccess<T> {
  pub fn new() -> QuickAccess<T> {
    QuickAccess {
      data: Vec::new(),
      hash: HashMap::new(),
    }
  }

  pub fn init(&mut self, data: Vec<T>, cb_key: fn(&T) -> Vec<String>) {
    self.reset();
    self.data = data;
    for (i, item) in self.data.iter().enumerate() {
      for key in cb_key(item) {
        self.hash.insert(key, i);
      }
    }
  }

  pub fn add(&mut self, data: T, keys: &[String]) {
    self.data.push(data);
    for key in keys {
      self.hash.insert(key.to_string(), self.data.len() - 1);
    }
  }

  pub fn reset(&mut self) {
    self.data.clear();
    self.hash.clear();
  }

  pub fn get(&self, key: &str) -> Option<&T> {
    if let Some(index) = self.hash.get(key) {
      if *index < self.data.len() {
        return self.data.get(*index);
      }
    }
    None
  }
}