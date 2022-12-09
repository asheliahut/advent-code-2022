// read the input from calorieInput.txt
// and write the output to calorieOutput.txt
// using the fs module in an asynchronous manner using async/await
// then split the input of numbers by empty lines
// and add up the numbers in each line until the empty line and display what section has the highest total
// advent of code 2022 day 1 part 2

import fs from "fs";
import * as path from "path";

const readInput = async () => {
  const input = await fs.promises.readFile(
    path.join(__dirname, "calorieInput.txt"),
    "utf-8"
  );
  return input;
};

const writeOutput = async (output: string) => {
  await fs.promises.writeFile(
    path.join(__dirname, "calorieOutput.txt"),
    output
  );
};

const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let listOfElves: number[] = [];
  let calories = 0;
  let currentSection: number = 0;
  let highestSection = 0;
  let highestCalories = 0;
  for (const line of lines) {
    if (line === "") {
      // put calories into listOfElves with currentSection as key
      listOfElves[currentSection] = calories;
      if (calories > highestCalories) {
        highestCalories = calories;
        highestSection = currentSection;
      }
      calories = 0;
      currentSection++;
    } else {
      calories += parseInt(line);
    }
  }

  // get the 3 highest values from listOfElves and add them together
  const highestValues = Object.values(listOfElves)
    .sort((a, b) => b - a)
    .slice(0, 3);
  const total = highestValues.reduce((a, b) => a + b, 0);

  const output = `The highest calorie section is ${highestSection} with ${highestCalories} calories and all 3 highest sections have a total of ${total} calories.`;
  await writeOutput(output);
};

main();
