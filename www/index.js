import { Game } from "exo-miner-core";
import { memory } from "exo-miner-core/exo_miner_core_bg";

const CELL_SIZE = 10; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

// Construct the universe, and get its width and height.
const game = Game.new();
const width = 128;
const height = 128;

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("exo-miner-core");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const renderLoop = (ts) => {
  game.run(ts);

  requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
