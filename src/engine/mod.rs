mod action;
mod event;
mod sync;

use action::Action;
use event::Event;
use sync::Sync;

// Declare Engine struct here
pub struct Engine {
    tick: f64,
    event: Event,
    action: Action,
    sync: Sync,
}
// Declare Engine methods here
impl Engine {
    pub fn new() -> Engine {
        let event = Event::new();
        let action = Action::new();
        let sync = Sync::new();
        Engine {
            tick: 0.0,
            event,
            action,
            sync,
        }
    }
    pub fn run(&mut self, ts: f64) {
        self.tick = ts;
        self.event.process(ts);
        self.sync.process(ts);
        self.action.process(ts);
    }
    pub fn reset(&mut self) {
        self.event.reset();
        self.action.reset();
        self.sync.reset();
    }
}
