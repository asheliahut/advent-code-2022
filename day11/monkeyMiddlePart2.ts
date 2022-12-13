// read the input from puzzleInput.txt
// advent of code 2022 day 11 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";
import BigNumber from "bignumber.js";

const readInput = async () => {
  // return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "monkeyMiddlePart2.txt"), output);
};

const operators: any = {
  "+": (a: BigNumber, b: BigNumber) => a.plus(b),
  "-": (a: BigNumber, b: BigNumber) => a.minus(b),
  "*": (a: BigNumber, b: BigNumber) => a.times(b),
  "/": (a: BigNumber, b: BigNumber) => a.dividedBy(b),
};

let lcm: BigNumber = new BigNumber(1);
let lcmNumbers: Set<number> = new Set();

class Monkey {
  private monkeyId: number = 0;
  private items: BigNumber[] = [];
  private operationOperator: string = "";
  private operationNumber: BigNumber = new BigNumber(0);
  private testDivisibilityNum: BigNumber = new BigNumber(0);
  private trueMonkeyNum: number = 0;
  private falseMonkeyNum: number = 0;
  public timesInspected: number = 0;

  constructor(
    monkeyId: number,
    items: BigNumber[],
    operationOperator: string,
    operationNumber: BigNumber,
    testDivisibilityNum: BigNumber,
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

  public addItem(item: BigNumber) {
    this.items.push(item);
  }

  public conductMonkeyBusiness(monkeys: Monkey[]): Monkey[] {
    let newMonkeyItems: BigNumber[] = [...this.items];
    // console.log(`Monkey ${this.monkeyId} has ${this.items.length} items`);
    for (const item of newMonkeyItems) {
      const tempCheckOperator: BigNumber = new BigNumber(-1);
      const tempCheckMod: BigNumber = new BigNumber(0);
      const tempOperationNumber: BigNumber = this.operationNumber.eq(
        tempCheckOperator
      )
        ? item
        : this.operationNumber;
      const newWorryLevel: BigNumber = operators[this.operationOperator](
        item,
        tempOperationNumber
      ).mod(lcm);

      if (newWorryLevel.mod(this.testDivisibilityNum).eq(tempCheckMod)) {
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
  monkeys.sort((a, b) => {
    return b.timesInspected - a.timesInspected;
  });

  const highestInspectedMonkey = monkeys[0];
  const secondHighestInspectedMonkey = monkeys[1];

  return [
    highestInspectedMonkey.timesInspected,
    secondHighestInspectedMonkey.timesInspected,
  ];
}

function lcm_two_numbers(x: BigNumber, y: BigNumber) {
  return x.eq(0) || y.eq(0)
    ? new BigNumber(0)
    : x.multipliedBy(y).abs().div(gcd_two_numbers(x, y));
}

function gcd_two_numbers(x: BigNumber, y: BigNumber) {
  x = x.abs();
  y = y.abs();
  while (!y.eq(0)) {
    var t = y;
    y = x.mod(y);
    x = t;
  }

  return x;
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

  lcm = Array.from(lcmNumbers).reduce(
    (a, b) => lcm_two_numbers(new BigNumber(a), new BigNumber(b)),
    new BigNumber(1)
  );

  // conduct 20 rounds of monkey business
  for (let i = 0; i < 10000; i++) {
    for (let j = 0; j < monkeys.length; j++) {
      monkeys = monkeys[j].conductMonkeyBusiness(monkeys);
    }
    console.log(`Round ${i} complete!`);
  }

  console.log(monkeys);

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
  let startingItemsWorryLevels: BigNumber[] = [];
  let operationOperator: string = "";
  let operationNumber: BigNumber = new BigNumber(0);
  let testDivisibilityNum: BigNumber = new BigNumber(0);
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
        .map((item) => new BigNumber(item));
    } else if (i === 2) {
      const lineSplit: string[] = line.trim().split(" ");
      operationOperator = lineSplit[4];
      operationNumber = new BigNumber(
        lineSplit[5] === "old" ? "-1" : lineSplit[5]
      );
    } else if (i === 3) {
      const lineSplit: string[] = line.trim().split(" ");
      testDivisibilityNum = new BigNumber(lineSplit[3]);
      lcmNumbers.add(parseInt(lineSplit[3]));
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
