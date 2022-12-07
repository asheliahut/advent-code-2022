// read the input from puzzleInput.txt
// advent of code 2022 day 7 part 1

import { readFileSync, writeFileSync } from "fs";
import * as path from 'path';

const readInput = async () => {
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "noSpacePart1.txt"), output);
};


const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let dirFileSizeLessThan100000 = 0;
  let output: string = "";
  
  // create a virtual disk
  // the outermost directory is / 
  // a line can contain a directory or a file or a command
  // a command line will always start with a $
  // a directory can contain a directory or a file
  // cd stands for change directory
  // ls stands for list directory
  // number filename stands for file size and file name
  let dir: any = { name: "/", parent: null, children: {} };
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
          // go back to parent directory
          console.log(currentDir);
          currentDir = currentDir.parent;
        } else if (dirName === "/") {
          currentDir = dir;
        }else {
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
        const newDir = { name: dirName, parent: currentDir, children: {} };
        currentDir.children[dirName] = newDir;
      } else {
        // this is a file
        const size = parseInt(parts[0]);
        const fileName = parts[1];
        const newFile = { name: fileName, size, type: "file" };
        currentDir.children[fileName] = newFile;
      }
    }
  }

  // loop through every directory and see if total combined file size is less than 100000
  // include the current directory in the calculation
  // eventually storing the combined file size of all directories that meet the criteria in dirFileSizeLessThan100000
  const traverseDir = (dir: any) => {
    let totalFileSize = 0;
    const children = dir.children;
    const childNames = Object.keys(children);
    for (let i = 0; i < childNames.length; i++) {
      const childName = childNames[i];
      const child = children[childName];
      if (child.type === "file") {
        totalFileSize += child.size;
      } else {
        totalFileSize += traverseDir(child);
      }
    }
    if (totalFileSize < 100000) {
      dirFileSizeLessThan100000 += totalFileSize;
    }
    return totalFileSize;
  };
  traverseDir(currentDir);
  
  
  

  

  output = `Directory Combined File Size: ${dirFileSizeLessThan100000}`;
  console.log(output);
  await writeOutput(output);
};

main();
