import {Universe} from "wasm-game-of-life";

const pre = document.getElementById("game-of-life-canvas");
const universe = Universe.new();


let last_tick_ts;

const renderLoop = (ts) => {
    if (!last_tick_ts || ts - last_tick_ts >= 50) {
        pre.textContent = universe.render();
        universe.tick();
        last_tick_ts = ts;
    }
    requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);
