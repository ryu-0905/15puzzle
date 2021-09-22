"use strict";
{
  class DrowPuzzle {
    constructor(puzzle, canvas) {
      this.puzzle = puzzle;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");

      this.img = document.createElement("img");
      this.img.src = "img/puzzle1.png";
    }

    drawImages() {
      for (let i = 0; i < this.PUZZLE_SIZE; i++) {
        for (let j = 0; j < this.PUZZLE_SIZE; j++) {
          const num = this.tiles[i][j];
          this.ctx.drawImage(
            this.img,
            (num % this.PUZZLE_SIZE) * this.TILE_SIZE,
            Math.floor(num / this.PUZZLE_SIZE) * this.TILE_SIZE,
            this.TILE_SIZE,
            this.TILE_SIZE,
            j * this.TILE_SIZE,
            i * this.TILE_SIZE,
            this.TILE_SIZE,
            this.TILE_SIZE
          );
          if (num === this.PUZZLE_SIZE ** 2 - 1) {
            this.ctx.fillStyle = "#666";
            this.ctx.fillRect(
              j * this.TILE_SIZE,
              i * this.TILE_SIZE,
              this.TILE_SIZE,
              this.TILE_SIZE
            );
          }
        }
      }
      console.log(this.tiles);
    }
  }

  class Puzzle {
    constructor(canvas, level) {
      this.canvas = canvas;

      this.level = level;
      this.tiles = [];
      this.isfinished = false;

      this.PUZZLE_SIZE = 4;
      this.TILE_SIZE = 70;
      this.UDLR = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
    }

    isOutside(destRow, destCol) {
      return (
        destRow < 0 ||
        destRow > this.PUZZLE_SIZE - 1 ||
        destCol < 0 ||
        destCol > this.PUZZLE_SIZE - 1
      );
    }

    setCanvas() {
      this.canvas.width = this.PUZZLE_SIZE * this.TILE_SIZE;
      this.canvas.height = this.PUZZLE_SIZE * this.TILE_SIZE;
    }
    setTiles() {
      for (let i = 0; i < this.PUZZLE_SIZE; i++) {
        this.tiles[i] = [];
        for (let j = 0; j < this.PUZZLE_SIZE; j++) {
          this.tiles[i][j] = i * this.PUZZLE_SIZE + j;
        }
      }
    }
    shuffleTiles(n) {
      let row = this.PUZZLE_SIZE - 1;
      let col = this.PUZZLE_SIZE - 1;
      while (n > 0) {
        const rn = Math.floor(Math.random() * this.UDLR.length);
        let destRow = row + this.UDLR[rn][0];
        let destCol = col + this.UDLR[rn][1];
        if (this.isOutside(destRow, destCol)) {
          continue;
        }
        [this.tiles[row][col], this.tiles[destRow][destCol]] = [
          this.tiles[destRow][destCol],
          this.tiles[row][col],
        ];
        row = destRow;
        col = destCol;
        n--;
      }
    }
    set() {
      this.setCanvas();
      this.setTiles();
      this.shuffleTiles(this.level);
      this.img.addEventListener("load", () => {
        this.drawImages();
      });
    }

    changeTiles(row, col) {
      if (this.tiles[row][col] === this.PUZZLE_SIZE ** 2 - 1) {
        return;
      }
      for (let i = 0; i < this.UDLR.length; i++) {
        let destRow = row + this.UDLR[i][0];
        let destCol = col + this.UDLR[i][1];
        if (this.isOutside(destRow, destCol)) {
          continue;
        }
        if (this.tiles[destRow][destCol] === this.PUZZLE_SIZE ** 2 - 1) {
          [this.tiles[row][col], this.tiles[destRow][destCol]] = [
            this.tiles[destRow][destCol],
            this.tiles[row][col],
          ];
        }
      }
    }
    finish() {
      this.isfinished = true;
      for (let i = 0; i < this.PUZZLE_SIZE; i++) {
        for (let j = 0; j < this.PUZZLE_SIZE; j++) {
          if (this.tiles[i][j] !== i * this.PUZZLE_SIZE + j) {
            this.isfinished = false;
          }
        }
      }
      if (this.isfinished) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "bold 32px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(
          "Game Clear!",
          this.canvas.width / 2,
          this.canvas.height / 2
        );
      }
    }
    activ() {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.addEventListener("click", (e) => {
        if (this.isfinished) {
          return;
        }
        const row = Math.floor((e.clientY - rect.top) / this.TILE_SIZE);
        const col = Math.floor((e.clientX - rect.left) / this.TILE_SIZE);
        this.changeTiles(row, col);
        this.drawImages();
        this.finish();
      });
    }

    run() {
      this.set();
      this.activ();
    }
  }

  function main() {
    const canvas = document.querySelector("canvas");
    if (typeof canvas.getContext === undefined) {
      return;
    }
    const puzzle = new Puzzle(canvas, 3);
    puzzle.run();
  }
  main();
}
