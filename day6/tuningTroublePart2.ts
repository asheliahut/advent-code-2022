// read the input from puzzleInput.txt
// advent of code 2022 day 6 part 2

import { readFileSync, writeFileSync } from "fs";
import * as path from 'path';

const readInput = async () => {
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "TuningTroublePart2.txt"), output);
};


const main = async () => {
  const input = await readInput();
  const line = input.split("\n")[0];
  let packetStart = 0;
  let output: string = "";


  for (let i = 14; i < line.length; i++) {
    // keep a buffer of 4 characters
    const buffer = line.substring(i - 14, i);
    //console.log(buffer);
    if (!containsDuplicateCharacter(buffer)) {
      packetStart = i;
      break;
    }  
  }
  
  

  output = `Start of Packet: ${packetStart}`;
  console.log(output);
  await writeOutput(output);
};

function containsDuplicateCharacter(str1: string): boolean {
  for (let i = 0; i < str1.length; i++) {
    let char = str1.charAt(i);
    if (str1.indexOf(char) != i) {
      return true;
    }
  }
  return false;
};

main();
