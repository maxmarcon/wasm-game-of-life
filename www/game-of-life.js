import {memory} from "wasm-game-of-life/wasm_game_of_life_bg.wasm";
import {Universe} from "wasm-game-of-life";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

let ctx;

export function initCanvasContext(canvasEl) {
    // Give the canvas room for all of our cells and a 1px border
    // around each of them.
    canvasEl.height = (CELL_SIZE + 1) * height + 1;
    canvasEl.width = (CELL_SIZE + 1) * width + 1;

    ctx = canvasEl.getContext('2d');
}

export function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

function getIndex(row, column) {
    return row * width + column;
};

export function drawCells() {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height / 8);
    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col)
            const byte_idx = Math.floor(idx / 8);
            const bit_idx = idx % 8;

            ctx.fillStyle = cells[byte_idx] & (1 << bit_idx) ? ALIVE_COLOR : DEAD_COLOR;

            ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE);
        }
    }

    ctx.stroke();
};

let last_tick_ts;
let animation_request_id;
let one_step = false;

function renderLoop(ts) {
    if (!last_tick_ts || ts - last_tick_ts >= 50) {
        universe.tick();
        drawGrid()
        drawCells();
        last_tick_ts = ts;
    }

    if (one_step) {
        one_step = false
        animation_request_id = null
    } else {
        nextAnimation()
    }
};

export function nextAnimation() {
    animation_request_id = requestAnimationFrame(renderLoop);
}

export function pauseAnimation() {
    cancelAnimationFrame(animation_request_id);
    animation_request_id = null;
}

export function singleAnimationStep() {
    one_step = true
    nextAnimation()
}


