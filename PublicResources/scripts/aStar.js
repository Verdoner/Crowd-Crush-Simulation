import {simulationData, chosenEventData, simulationHTML} from "./simulation.js";
import {coordsToId, idToCoords} from "./arena.js";
export {aStar}
// Class to hold to necessary parameters of the nodes.
class node {
    constructor(row, column){
    this.row = row;
    this.column = column;
    this.h=0;
    this.g=0;
    this.f=0;
    this.parentNode=undefined;
    }
}

// This is our heuristic which calculates the expected distance from currentNode to the endNode.
// Function finds a vector's x and y values and returns the length of the vector with 3 decimals
function euclideanDistance(currentNode, endNode){
    let x = currentNode.column - endNode.column;
    let y = currentNode.row - endNode.row;
    return Math.round(Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)))*1000)/1000;
}

// Calculates the cost of moving to another node.
/*function costOfMove(currentNode){
    return simulationData.simulationArena[coordsToId(currentNode.row,currentNode.column)].peopleInCell.length;
}*/

//Checks if the current node is in the grid
//Returns true if the current node is in the grid, false if not.
function isValid(currentNode) {
    if (currentNode.row < 0 ||
        currentNode.column >= chosenEventData.numberOfColumns ||
        currentNode.row >= chosenEventData.numberOfRows ||
        currentNode.column < 0){
        return false;
    }
    else if(simulationData.simulationArena[coordsToId(currentNode.row,currentNode.column)].peopleInCell.length === 500){
        return false;
    }
    else if(simulationData.simulationArena[coordsToId(currentNode.row,currentNode.column)].peopleInCell.length === 600){
        return false;
    }
    return true;
}

// Checks if the current node is the current goal node
function endNodeReached(currentNode, endNode) {
    return (currentNode.row === endNode.row) && (currentNode.column === endNode.column);
}

// Finds the neighbours of the current node and initializes their different parameters. 
function findNeighbours(currentNode) {
    let neighbours = [
        new node(currentNode.row-1, currentNode.column),
        new node(currentNode.row-1, currentNode.column+1),
        new node(currentNode.row, currentNode.column+1),
        new node(currentNode.row+1, currentNode.column+1),
        new node(currentNode.row+1, currentNode.column),
        new node(currentNode.row+1, currentNode.column-1),
        new node(currentNode.row, currentNode.column-1),
        new node(currentNode.row-1, currentNode.column-1)
    ];
   for (let i = neighbours.length-1; i >= 0; i--) {
        if(!isValid(neighbours[i])){
            neighbours.splice(i, 1);
        }
   }
   return neighbours;
}

// Checks which neighbour is the best/cheapest move.
function bestMove(neighbours, endNode){
    let cheapestMove = neighbours[0];
    for (let i = 1; i < neighbours.length; i++) {
        //if one of the neighbours are the targeted goal, the person is moved there by force
        if (neighbours[i].row === endNode.row && neighbours[i].column === endNode.column){
            cheapestMove = neighbours[i];
            break;
        }
        else if (neighbours[i].distanceToTarget < cheapestMove.distanceToTarget) {
            cheapestMove = neighbours[i];
        }
    }
    return coordsToId(cheapestMove.row, cheapestMove.column);
}

function aStar(location, goalNode, weightOfMove){
    let closed = [];
    let open = [];
    /*//initializes the current location and end location as coordinates
    let locationCoords = idToCoords(location);
    let goalNodeCoords = idToCoords(goalNode);
    let currentNode = new node(locationCoords[0], locationCoords[1], 0);
    let endNode = new node(goalNodeCoords[0], goalNodeCoords[1], 0);
*/
    //returns -1 if the targeted goal has been reached. is used to determine where the next goal is in createPeople.js

/*
    //Calculates the expected distance from the current node to goal and initializes its neighbours.
    currentNode.distanceToTarget = euclideanDistance(currentNode, endNode);

    let neighbours = findNeighbours(currentNode, endNode, weightOfMove);
    return bestMove(neighbours, endNode);*/
    let reachedGoal = false, exists=false;
    let locationCoords = idToCoords(location);
    let goalNodeCoords = idToCoords(goalNode);
    let currentNode;
    let startNode = new node(locationCoords[0], locationCoords[1]);
    let endNode = new node(goalNodeCoords[0], goalNodeCoords[1]);
    if (endNodeReached(startNode, endNode)) {
        return -1;
    }
    startNode.g = euclideanDistance(startNode, startNode);
    startNode.h = euclideanDistance(startNode, endNode);
    startNode.f = startNode.g+startNode.h;
    open.push(startNode);
    do{
        open.sort((a, b) => {
            return a.f - b.f;
        });
        currentNode = open[0];
        open.splice(0, 1);
        closed.push(currentNode);
        //simulationHTML.ctx.fillStyle = "#ff0101";
        //simulationHTML.ctx.fillRect(currentNode.column, currentNode.row, 1, 1);
        if(currentNode.column === endNode.column && currentNode.row === endNode.row){
            reachedGoal = false;
            break;
        }
        let neighbours = findNeighbours(currentNode, endNode);
        for (let i = 0; i < neighbours.length; i++) {
            exists = false;
            for (let j = 0; j < closed.length; j++) {
                if (neighbours[i].column === closed[j].column && neighbours[i].row === closed[j].row) {
                    exists = true;
                }
            }
            if (!exists) {
                //simulationHTML.ctx.fillStyle = "#0014ff";
                //simulationHTML.ctx.fillRect(neighbours[i].column, neighbours[i].row, 1, 1);
                exists = false;
                for (let j = 0; j < open.length; j++) {
                    if (neighbours[i].column === open[j].column && neighbours[i].row === open[j].row) {
                        exists = true;
                    }
                }
                let g = euclideanDistance(neighbours[i], startNode);
                let h = euclideanDistance(neighbours[i], endNode);
                if (!exists || neighbours[i].g > g) {
                    neighbours[i].g = g;
                    neighbours[i].h = h;
                    neighbours[i].f = g + h;
                    neighbours[i].parentNode = currentNode;
                    if (!exists) {
                        open.push(neighbours[i]);
                    }
                }
            }
        }
    }
    while(!reachedGoal);
    let path = [closed[closed.length-1]];
    do{
        path.push(path[path.length-1].parentNode);
    }
    while(path[path.length-1].column !== startNode.column && path[path.length-1].row !== startNode.row);
    for (let i = 0; i < path.length; i++) {
        //simulationHTML.ctx.fillStyle = "#00ff33";
        //simulationHTML.ctx.fillRect(path[i].column, path[i].row, 1, 1);
    }
    return coordsToId(path[path.length-2].row, path[path.length-2].column);
}



