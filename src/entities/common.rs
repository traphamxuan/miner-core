use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct Position {
  x: f64,
  y: f64,
}
