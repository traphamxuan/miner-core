mod utils;
mod components;
mod engine;
mod entities;
mod dsa;

use wasm_bindgen::prelude::*;
use components::Component;
use engine::Engine;
use entities::{raw::RawGameData, base::RawBase};

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);

    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

// Next let's define a macro that's like `println!`, only it works for
// `console.log`. Note that `println!` doesn't actually work on the wasm target
// because the standard library currently just eats all output. To get
// `println!`-like behavior in your app you'll likely want a macro like this.

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub struct Game {
    engine: Engine,
    component: Component,
}

#[wasm_bindgen]
pub struct GameData(RawGameData);

#[wasm_bindgen]
pub struct BaseGame(RawBase);

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new(_base_data: BaseGame) -> Game {
        let engine = Engine::new();
        let component = Component::new();

        Game {
            engine,
            component,
        }
    }

    pub fn load(&mut self, _raw_data : GameData) {
        self.component.load();
    }

    pub fn unload(&mut self) {
        self.engine.reset();
        self.component.reset();
    }

    pub fn action(&mut self, action: i32) {
        self.component.action(action);
    }

    pub fn run(&mut self, ts: f64) {
        // console_log!("Game run at {}", ts);
        self.engine.run(ts);
    }

    pub fn to_raw(self) -> Option<GameData> {
        None
    }
}