// read the input from puzzleInput.txt
// advent of code 2022 day 7 part 2

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";

const readInput = async () => {
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "noSpacePart2.txt"), output);
};

const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let output: string = "";

  // create a virtual disk
  // the outermost directory is /
  // a line can contain a directory or a file or a command
  // a command line will always start with a $
  // a directory can contain a directory or a file
  // cd stands for change directory
  // ls stands for list directory
  // number filename stands for file size and file name
  let dir: any = { name: "/", parent: null, children: {}, size: 0 };
  let currentDir = dir;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("$")) {
      // this is a command line
      const command = line.split(" ")[1];
      if (command === "ls") {
        // list current directory
        const children = currentDir.children;
        const childNames = Object.keys(children);
        for (let j = 0; j < childNames.length; j++) {
          const childName = childNames[j];
          const child = children[childName];
          if (child.type === "file") {
            //console.log(`${child.size} ${child.name}\n`);
          } else {
            //console.log(`${child.name}\n`);
          }
        }
      } else if (command === "cd") {
        const dirName = line.split(" ")[2];
        if (dirName === "..") {
          currentDir = currentDir.parent;
        } else if (dirName === "/") {
          // do nothing as we are already at the root directory
        } else {
          // go to the child directory
          const childDir = currentDir.children[dirName];
          if (childDir) {
            currentDir = childDir;
          }
        }
      }
    } else {
      // this is a directory or a file
      const parts = line.split(" ");
      if (parts[0] === "dir") {
        // this is a directory
        const dirName = parts[1];
        const newDir = {
          name: dirName,
          parent: currentDir,
          children: {},
          size: 0,
        };
        currentDir.children[dirName] = newDir;
      } else {
        // this is a file
        const size = parseInt(parts[0]);
        const fileName = parts[1];
        const newFile = { name: fileName, size, type: "file" };
        currentDir.children[fileName] = newFile;
        currentDir.size += size;
        const originalDir = currentDir;

        while (currentDir.parent) {
          currentDir = currentDir.parent;
          currentDir.size += size;
        }

        currentDir = originalDir;
      }
    }
  }

  const freeSpace = 70000000 - dir.size;
  const freeSpaceNeeded = 30000000 - freeSpace;
  console.log(`free space needed ${freeSpaceNeeded}`);

  const potentialDirsToDelete: any[] = [];
  const getLargestForFreeSpace = (curDir: any) => {
    const children = curDir.children;
    const childNames = Object.keys(children);
    let largestDirForFreeSpace = curDir;
    for (let i = 0; i < childNames.length; i++) {
      const childName = childNames[i];
      const child = children[childName];
      if (child.type === "file") {
        // this is a file
      } else {
        // this is a directory
        const largestDirInChild = getLargestForFreeSpace(child);

        if (largestDirInChild.size >= freeSpaceNeeded) {
          largestDirForFreeSpace = largestDirInChild;
          potentialDirsToDelete.push(largestDirForFreeSpace);
        }
      }
    }

    return largestDirForFreeSpace;
  };

  getLargestForFreeSpace(dir);

  // loop over potentialDirsToDelete and find the smallest one
  let smallestInPotentialToDelete = potentialDirsToDelete[0];
  for (let i = 1; i < potentialDirsToDelete.length; i++) {
    const potentialDir = potentialDirsToDelete[i];
    if (potentialDir.size < smallestInPotentialToDelete.size) {
      smallestInPotentialToDelete = potentialDir;
    }
  }

  output = `Dir to delete size: ${smallestInPotentialToDelete.size}`;
  console.log(output);
  await writeOutput(output);
};

main();
