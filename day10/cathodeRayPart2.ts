// read the input from puzzleInput.txt
// advent of code 2022 day 10 part 2

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  //return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "cathodeRayPart2.txt"), output);
};

const cycleForInstruction: any = {
  "noop": 1,
  "addx": 2,
};

class CPU {
  private cycle: number = 0;
  private registerX: number = 0;
  private instructions: string[] = [];
  private currentInstruction: string = "";
  private CRT: string[] = [];

  constructor(instructions: string[]) {
    this.cycle = 0;
    this.registerX = 1;
    this.instructions = instructions;
  }

  public showCRT(): string {
    return this.CRT.join("\n");
  }

  private nextInstruction(): string|undefined {
    const instruction = this.instructions.shift();
    if (!instruction) {
      return undefined;
    }
    this.currentInstruction = instruction;

    return instruction;
  }

  private executeInstruction(instruction: string) {
    const curInstruction = instruction.split(" ");
    switch(curInstruction[0]) {
      case "noop":
        break;
      case "addx":
        this.registerX += parseInt(curInstruction[1]);
        break;
      default:
        throw new Error(`Unknown instruction: ${curInstruction[0]}`);
    }
  }

  private drawPixel() {
    const crtIdx = Math.floor((this.cycle) / 40);
    const pixelStart = this.registerX - 1;
    const pixelEnd = this.registerX + 1;
    const pixelPlacement = this.cycle % 40;

    if (pixelPlacement >= pixelStart && pixelPlacement <= pixelEnd) {
      this.CRT[crtIdx] = this.CRT[crtIdx] ? this.CRT[crtIdx] + "#" : "#";
    } else {
      this.CRT[crtIdx] = this.CRT[crtIdx] ? this.CRT[crtIdx] + "." : ".";
    }
  }

  public execute() {
    while(this.nextInstruction()) {
      const curInstruction = this.currentInstruction.split(" ")[0];
      for(let i = 0; i < cycleForInstruction[curInstruction]; i++) {
        this.drawPixel();
        this.cycle++;
      }

      this.executeInstruction(this.currentInstruction);
    }
  }
}

const main = async () => {
  const input = await readInput();
  const instructions = input.split("\n");
  let output: string = "";

  const cpu = new CPU(instructions);
  cpu.execute();
  const crt = cpu.showCRT();

  output = crt;
  console.log(output);
  await writeOutput(output);
};

main();
