// read the input from puzzleInput.txt
// and write the output to RPSOutput.txt
// A is rock, B is paper, C is scissors for player 1
// X is rock, Y is paper, Z is scissors for player 2
// if both players choose the same, it's a draw
// advent of code 2022 day 2 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from 'path';

const readInput = async () => {
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "RPSOutputPart1.txt"), output);
};

// create scoring enum based on rps
enum SCORING {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
};
// create map of values
enum RPS {
  X = "Rock",
  Y = "Paper",
  Z = "Scissors",
  A = "Rock",
  B = "Paper",
  C = "Scissors",
};

const main = async () => {
  const input = await readInput();
  let playerScore = 0;
  let output = "";
  // loop over input line by line
  input.split("\n").forEach((line) => {
    // split the line into two players
    const [elfInput, playerInputStr] = line.split(" ");
    // strip new line from playerInputStr
    const playerInput: string = playerInputStr.replace("\n", "");
    // convert playerInput X,Y,Z to A,B,C
    const player = RPS[playerInput as keyof typeof RPS];
    const elf = RPS[elfInput as keyof typeof RPS];
    if (elf === player) {
      playerScore += SCORING[player as keyof typeof SCORING];
      playerScore += 3;
    } else if (player === "Rock" && elf === "Scissors") {
      playerScore += SCORING[player as keyof typeof SCORING];
      playerScore += 6;
    } else if (player === "Paper" && elf === "Rock") {
      playerScore += SCORING[player as keyof typeof SCORING];
      playerScore += 6;
    } else if (player === "Scissors" && elf === "Paper") {
      playerScore += SCORING[player as keyof typeof SCORING];
      playerScore += 6;
    } else {
      playerScore += SCORING[player as keyof typeof SCORING];
    }
  });

  output = `Player score: ${playerScore}`;
  console.log(output);
  await writeOutput(output);
};

main();
