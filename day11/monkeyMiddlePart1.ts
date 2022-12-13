// read the input from puzzleInput.txt
// advent of code 2022 day 11 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  // return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "monkeyMiddlePart1.txt"), output);
};

const operators: any = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
};

class Monkey {
  private monkeyId: number = 0;
  private items: number[] = [];
  private operationOperator: string = "";
  private operationNumber: number = 0;
  private testDivisibilityNum: number = 0;
  private trueMonkeyNum: number = 0;
  private falseMonkeyNum: number = 0;
  public timesInspected: number = 0;

  constructor(
    monkeyId: number,
    items: number[],
    operationOperator: string,
    operationNumber: number,
    testDivisibilityNum: number,
    trueMonkeyNum: number,
    falseMonkeyNum: number
  ) {
    this.monkeyId = monkeyId;
    this.items = items;
    this.operationOperator = operationOperator;
    this.operationNumber = operationNumber;
    this.testDivisibilityNum = testDivisibilityNum;
    this.trueMonkeyNum = trueMonkeyNum;
    this.falseMonkeyNum = falseMonkeyNum;
  }

  public addItem(item: number) {
    this.items.push(item);
  }

  public conductMonkeyBusiness(monkeys: Monkey[]): Monkey[] {
    let newMonkeyItems: number[] = [...this.items];
    // console.log(`Monkey ${this.monkeyId} has ${this.items.length} items`);
    for (const item of newMonkeyItems) {
      const tempOperationNumber: number =
        this.operationNumber === -1 ? item : this.operationNumber;
      const newWorryLevel = Math.floor(
        operators[this.operationOperator](item, tempOperationNumber) / 3
      );

      if (newWorryLevel % this.testDivisibilityNum === 0) {
        monkeys[this.trueMonkeyNum].addItem(newWorryLevel);
      } else {
        monkeys[this.falseMonkeyNum].addItem(newWorryLevel);
      }

      // remove the item from the current monkey's items
      this.items.shift();
      this.timesInspected++;
    }

    return monkeys;
  }
}

function getTwoHighestInspectedMonkeys(monkeys: Monkey[]): number[] {
  let highestInspectedMonkey: Monkey = monkeys[0];
  let secondHighestInspectedMonkey: Monkey = monkeys[0];

  for (let monkey of monkeys) {
    if (monkey.timesInspected > highestInspectedMonkey.timesInspected) {
      secondHighestInspectedMonkey = highestInspectedMonkey;
      highestInspectedMonkey = monkey;
    } else if (
      monkey.timesInspected > secondHighestInspectedMonkey.timesInspected
    ) {
      secondHighestInspectedMonkey = monkey;
    }
  }

  return [
    highestInspectedMonkey.timesInspected,
    secondHighestInspectedMonkey.timesInspected,
  ];
}

const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let output: string = "";
  let curMonkeyInput: string[] = [];
  let monkeys: Monkey[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // console.log(line);
    if (line === "") {
      monkeys.push(parseMonkey(curMonkeyInput));
      curMonkeyInput = [];
      continue;
    }

    curMonkeyInput.push(line);
  }

  // conduct 20 rounds of monkey business
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < monkeys.length; j++) {
      monkeys = monkeys[j].conductMonkeyBusiness(monkeys);
    }
  }

  // get the two monkeys that have been inspected the most
  const [highestInspectedMonkey, secondHighestInspectedMonkey] =
    getTwoHighestInspectedMonkeys(monkeys);
  console.log(
    `Highest Inspected Monkey: ${highestInspectedMonkey}, Second Highest Inspected Monkey: ${secondHighestInspectedMonkey}`
  );
  const monkeyBusinessLevel =
    highestInspectedMonkey * secondHighestInspectedMonkey;

  output = `Monkey Business Level after 20 rounds: ${monkeyBusinessLevel}`;
  console.log(output);
  await writeOutput(output);
};

function parseMonkey(lines: string[]): Monkey {
  let monkeyId: number = 0;
  let startingItemsWorryLevels: number[] = [];
  let operationOperator: string = "";
  let operationNumber: number = 0;
  let testDivisibilityNum: number = 0;
  let trueTest: number = 0;
  let falseTest: number = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0) {
      const monkeyIdPlusColon: string = line.split(" ")[1];
      monkeyId = parseInt(
        monkeyIdPlusColon.substring(0, monkeyIdPlusColon.indexOf(":"))
      );
    } else if (i === 1) {
      // parse the comma and space seperated list of numbers with a prefix of "Starting items: "
      startingItemsWorryLevels = line
        .trim()
        .split(" ")[2]
        .split(",")
        .map((item) => parseInt(item));
    } else if (i === 2) {
      const lineSplit: string[] = line.trim().split(" ");
      operationOperator = lineSplit[4];
      operationNumber = parseInt(lineSplit[5] === "old" ? "-1" : lineSplit[5]);
    } else if (i === 3) {
      const lineSplit: string[] = line.trim().split(" ");
      testDivisibilityNum = parseInt(lineSplit[3]);
    } else if (i === 4) {
      const lineSplit: string[] = line.trim().split(" ");
      trueTest = parseInt(lineSplit[5]);
    } else if (i === 5) {
      const lineSplit: string[] = line.trim().split(" ");
      falseTest = parseInt(lineSplit[5]);
    }
  }

  return new Monkey(
    monkeyId,
    startingItemsWorryLevels,
    operationOperator,
    operationNumber,
    testDivisibilityNum,
    trueTest,
    falseTest
  );
}

main();
