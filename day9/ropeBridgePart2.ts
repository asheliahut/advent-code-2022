// read the input from puzzleInput.txt
// advent of code 2022 day 9 part 2

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  // return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "ropeBridgePart2.txt"), output);
};

type RopeKnot = {
  x: number;
  y: number;
};

type RopeTail = {
  x: number;
  y: number;
  seenXY: Set<string>;
};

const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let output: string = "";
  let tailKnot: RopeTail = { x: 0, y: 0, seenXY: new Set() };
  // preset the 0,0 coordinate to be seen
  tailKnot.seenXY.add(JSON.stringify({ x: 0, y: 0 }));
  const knots: RopeKnot[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  // let grid: ropeHead[][]|ropeTail[][]|null[][] = [[tail,head]];
  // console.log(grid);

  // loop through each line and follow the directions
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].split(" ");
    const direction = line[0];
    const distance = parseInt(line[1]);
    // console.log(direction, distance);

    // move the head
    switch (direction) {
      case "R":
        for (let j = 0; j < distance; j++) {
          knots[0].x++;
          for (let k = 1; k < knots.length; k++) {
            if (isKnotAdjacentToPrevious(knots[k - 1], knots[k])) {
              break;
            }
            knots[k] = moveKnot(knots[k - 1], knots[k]);
          }
          // check if the tail is no longer next to last knot
          if (!isKnotAdjacentToPrevious(knots[8], tailKnot)) {
            tailKnot = moveTail(knots[8], tailKnot);
          }
        }
        break;
      case "U":
        for (let j = 0; j < distance; j++) {
          knots[0].y++;
          for (let k = 1; k < knots.length; k++) {
            if (isKnotAdjacentToPrevious(knots[k - 1], knots[k])) {
              break;
            }
            knots[k] = moveKnot(knots[k - 1], knots[k]);
          }
          // check if the tail is no longer next to last knot
          if (!isKnotAdjacentToPrevious(knots[8], tailKnot)) {
            tailKnot = moveTail(knots[8], tailKnot);
          }
        }
        break;
      case "L":
        for (let j = 0; j < distance; j++) {
          knots[0].x--;
          for (let k = 1; k < knots.length; k++) {
            if (isKnotAdjacentToPrevious(knots[k - 1], knots[k])) {
              break;
            }
            knots[k] = moveKnot(knots[k - 1], knots[k]);
          }
          // check if the tail is no longer next to last knot
          if (!isKnotAdjacentToPrevious(knots[8], tailKnot)) {
            tailKnot = moveTail(knots[8], tailKnot);
          }
        }
        break;
      case "D":
        for (let j = 0; j < distance; j++) {
          knots[0].y--;
          for (let k = 1; k < knots.length; k++) {
            if (isKnotAdjacentToPrevious(knots[k - 1], knots[k])) {
              break;
            }
            knots[k] = moveKnot(knots[k - 1], knots[k]);
          }
          // check if the tail is no longer next to last knot
          if (!isKnotAdjacentToPrevious(knots[8], tailKnot)) {
            tailKnot = moveTail(knots[8], tailKnot);
          }
        }
        break;
    }
  }

  const numTimesTailVisits = tailKnot.seenXY.size;
  console.log(tailKnot.seenXY);

  output = `Number of times tail visits: ${numTimesTailVisits}`;
  console.log(output);
  await writeOutput(output);
};

function isKnotAdjacentToPrevious(
  previous: RopeKnot,
  current: RopeKnot | RopeTail
): boolean {
  if (previous.x === current.x && previous.y === current.y) {
    return true;
  }
  if (previous.x === current.x && previous.y === current.y + 1) {
    return true;
  }
  if (previous.x === current.x && previous.y === current.y - 1) {
    return true;
  }
  if (previous.x === current.x + 1 && previous.y === current.y) {
    return true;
  }
  if (previous.x === current.x - 1 && previous.y === current.y) {
    return true;
  }
  if (previous.x === current.x + 1 && previous.y === current.y + 1) {
    return true;
  }
  if (previous.x === current.x + 1 && previous.y === current.y - 1) {
    return true;
  }
  if (previous.x === current.x - 1 && previous.y === current.y + 1) {
    return true;
  }
  if (previous.x === current.x - 1 && previous.y === current.y - 1) {
    return true;
  }
  return false;
}

function moveKnot(previous: RopeKnot, current: RopeKnot): RopeKnot {
  const newKnot: RopeKnot = { x: current.x, y: current.y };

  // check for diagonal cases
  if (newKnot.x < previous.x && newKnot.y < previous.y) {
    newKnot.x++;
    newKnot.y++;

    return newKnot;
  }

  if (newKnot.x > previous.x && newKnot.y > previous.y) {
    newKnot.x--;
    newKnot.y--;

    return newKnot;
  }

  if (newKnot.x < previous.x && newKnot.y > previous.y) {
    newKnot.x++;
    newKnot.y--;

    return newKnot;
  }

  if (newKnot.x > previous.x && newKnot.y < previous.y) {
    newKnot.x--;
    newKnot.y++;

    return newKnot;
  }

  // check for horizontal/vertical cases
  if (newKnot.x < previous.x) {
    newKnot.x++;

    return newKnot;
  }
  if (newKnot.x > previous.x) {
    newKnot.x--;

    return newKnot;
  }
  if (newKnot.y < previous.y) {
    newKnot.y++;

    return newKnot;
  }
  if (newKnot.y > previous.y) {
    newKnot.y--;

    return newKnot;
  }

  return newKnot;
}

function moveTail(head: RopeKnot, tail: RopeTail): RopeTail {
  const newTail: RopeTail = { x: tail.x, y: tail.y, seenXY: tail.seenXY };

  // check for diagonal cases
  if (newTail.x < head.x && newTail.y < head.y) {
    newTail.x++;
    newTail.y++;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }

  if (newTail.x > head.x && newTail.y > head.y) {
    newTail.x--;
    newTail.y--;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }

  if (newTail.x < head.x && newTail.y > head.y) {
    newTail.x++;
    newTail.y--;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }

  if (newTail.x > head.x && newTail.y < head.y) {
    newTail.x--;
    newTail.y++;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }

  // check for horizontal/vertical cases
  if (newTail.x < head.x) {
    newTail.x++;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }
  if (newTail.x > head.x) {
    newTail.x--;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }
  if (newTail.y < head.y) {
    newTail.y++;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }
  if (newTail.y > head.y) {
    newTail.y--;
    newTail.seenXY.add(JSON.stringify({ x: newTail.x, y: newTail.y }));

    return newTail;
  }

  return newTail;
}

main();
