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
  await writeFileSync(path.join(__dirname, "RPSOutputPart2.txt"), output);
};

// create scoring enum based on rps
enum SCORING {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
};
// create map of values
enum RPS {
  A = "Rock",
  B = "Paper",
  C = "Scissors",
};

enum RPSPlayer {
  X = "lose",
  Y = "draw",
  Z = "win",
}

enum RPSLose {
  Rock = "Scissors",
  Paper = "Rock",
  Scissors = "Paper",
}

enum RPSWin {
  Rock = "Paper",
  Paper = "Scissors",
  Scissors = "Rock",
}

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
    const player = RPSPlayer[playerInput as keyof typeof RPSPlayer];
    const elf = RPS[elfInput as keyof typeof RPS];
    if (player === "win") {
      playerScore += SCORING[RPSWin[elf as keyof typeof RPSWin] as keyof typeof SCORING];
      playerScore += 6;
    } else if (player === "lose") {
      playerScore += SCORING[RPSLose[elf as keyof typeof RPSLose] as keyof typeof SCORING];
    } else {
      playerScore += SCORING[elf as keyof typeof SCORING];
      playerScore += 3;
    }
    
  });

  output = `Player score: ${playerScore}`;
  console.log(output);
  await writeOutput(output);
};

main();
