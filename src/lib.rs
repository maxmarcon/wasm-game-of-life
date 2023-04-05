mod utils;

use fixedbitset::FixedBitSet;
use rand::Rng;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: FixedBitSet,
}

#[wasm_bindgen]
impl Universe {
    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const u32 {
        self.cells.as_slice().as_ptr()
    }

    pub fn tick(&mut self) {
        let mut next = self.cells.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                let next_cell = match (cell, live_neighbors) {
                    // live cells with 2 or 3 live neighbors survive
                    (true, 2) | (true, 3) => true,
                    // dead cells with 3 live neighbors become alive
                    (false, 3) => true,
                    // all other cells die or stay dead
                    (_, _) => false,
                };

                next.set(idx, next_cell);
            }
        }

        self.cells = next;
    }

    pub fn new() -> Universe {
        let width: u32 = 64;
        let height: u32 = 64;
        let mut rng = rand::thread_rng();
        let capacity = (width * height) as usize;

        let mut cells = FixedBitSet::with_capacity((width * height) as usize);
        (0..capacity).for_each(|i| cells.set(i, rng.gen::<bool>()));

        Universe {
            width,
            height,
            cells,
        }
    }

    fn get_index(&self, row: u32, col: u32) -> usize {
        (row * self.width + col) as usize
    }

    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for delta_row in [self.height - 1, 0, 1] {
            for delta_col in [self.width - 1, 0, 1] {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);
                count += self.cells[idx] as u8;
            }
        }
        count
    }
}
