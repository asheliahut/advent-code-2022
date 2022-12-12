// read the input from puzzleInput.txt
// advent of code 2022 day 12 part 2

import { readFileSync, writeFileSync } from "fs";
import * as path from "path";
import { WeightedDiGraph, Dijkstra, Edge } from "js-graph-algorithms";

const readInput = async () => {
  // return await readFileSync(path.join(__dirname, "example.txt"), "utf8");
  return await readFileSync(path.join(__dirname, "puzzleInput.txt"), "utf8");
};

const writeOutput = async (output: string) => {
  await writeFileSync(path.join(__dirname, "hillClimbingPart2.txt"), output);
};
const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i));
let elevationMap: any = {}
let startingNode: number = 0;
let endNode: number = 0;
let possibleStarts: number[] = [];
letters.forEach((letter, index) => {
  elevationMap[letter] = index + 1;
})

function parseInputIntoGraph(lines: string[]): WeightedDiGraph {
  let numNodes: number = 0
  lines.forEach((line, index) => {
    numNodes += line.length;
  });
  const graph: WeightedDiGraph = new WeightedDiGraph(numNodes);


  let numTraversed: number = 0;
  let matrix: number[][] = [];
  for (let i = 0; i < lines.length; i++) {
    const row = lines[i].split("");
    const finalRow: number[] = [];
    // convert all letters to numbers
    for (let j = 0; j < row.length; j++) {
      if (row[j] === "S") {
        startingNode = numTraversed;
        possibleStarts.push(numTraversed);
        finalRow[j] = 1;
        numTraversed++;
        continue;
      }
      if (row[j] === "E") {
        endNode = numTraversed;
        finalRow[j] = 26;
        numTraversed++;
        continue;
      }
      finalRow[j] = elevationMap[row[j]];

      if (finalRow[j] === 1) {
        possibleStarts.push(numTraversed);
      }
      numTraversed++;
    }
    matrix.push(finalRow);
  }

  // add edges to graph
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const currentNode = matrix[i][j];
      const leftNode = matrix[i][j - 1];
      const rightNode = matrix[i][j + 1];
      const topNode = matrix[i - 1] ? matrix[i - 1][j] : null;
      const bottomNode = matrix[i + 1] ? matrix[i + 1][j] : null;
      const currentNodeNum = (i * matrix[i].length) + j;
      const leftNodeNum = (i * matrix[i].length) + j - 1;
      const rightNodeNum = (i * matrix[i].length) + j + 1;
      const topNodeNum = ((i - 1) * matrix[i].length) + j;
      const bottomNodeNum = ((i + 1) * matrix[i].length) + j;

      if (leftNode <= currentNode || leftNode === (currentNode + 1)) {
        graph.addEdge(new Edge(currentNodeNum, leftNodeNum, 1));
      }
      if (rightNode <= currentNode || rightNode === (currentNode + 1)) {
        graph.addEdge(new Edge(currentNodeNum, rightNodeNum, 1));
      }
      if (topNode && (topNode <= currentNode || topNode === (currentNode + 1))) {
        graph.addEdge(new Edge(currentNodeNum, topNodeNum, 1));
      }
      if (bottomNode && (bottomNode <= currentNode || bottomNode === (currentNode + 1))) {
        graph.addEdge(new Edge(currentNodeNum, bottomNodeNum, 1));
      }
    }
  }
  return graph;
}




const main = async () => {
  const input = await readInput();
  const lines = input.split("\n");
  let output: string = "";
  let lowestSteps: number = Number.MAX_SAFE_INTEGER;

  const graph: WeightedDiGraph = parseInputIntoGraph(lines);

  for(let i = 0; i < possibleStarts.length; i++) {
    const dijkstra = new Dijkstra(graph, possibleStarts[i])
    
    if(dijkstra.hasPathTo(endNode)){
      const path = dijkstra.pathTo(endNode);
      if (path.length < lowestSteps) {
        lowestSteps = path.length;
      }
    }
    
  }

  output = `Number steps required: ${lowestSteps}`;
  console.log(output);
  await writeOutput(output);
};

main();
