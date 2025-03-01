import {simulationData, simulationHTML, chosenEventData, cell} from "./simulation.js";
import {loveParadeData} from "./loveparade.js";
import {hajjData} from "./hajj.js";
import {itaewonData} from "./itaewon.js"
export {generateArena, coordsToId, idToCoords, insertBarrierToggle}

let mouseDown = false;
document.body.onmousedown = function(e) {
  mouseDown = true;
  //Insert barrier on mouse click
  insertBarriers(e);
}
document.body.onmouseup = function() {
  mouseDown = false;
}

//Insert barrier on mouse move (drawing)
document.body.onmousemove = (e) => insertBarriers(e);

let insertBarriers = (e) => {
    if (insertingBarriers === 1 && mouseDown) {
        let coords = getMousePos(e);  //gets the coordinates for the pixed the mouse is currently on
        let scaleW = simulationHTML.canvas.offsetWidth/chosenEventData.numberOfColumns;
        let scaleH = simulationHTML.canvas.offsetHeight/chosenEventData.numberOfRows;
        //if statement checks if the mouse is on the simulation area
        if(coords.y >= 0 && coords.y < chosenEventData.numberOfRows*scaleH && coords.x >= 0 && coords.x < chosenEventData.numberOfColumns*scaleW) {
            simulationHTML.ctx.fillStyle = "#ff00b7"; //The color chosen for the barrier
            simulationHTML.ctx.fillRect(coords.x/scaleW, coords.y/scaleH, 1, 1); //colors the exact pixel the mouse is on
            simulationData.simulationArena[coordsToId(Math.floor(coords.y/scaleH), Math.floor(coords.x/scaleW))].peopleInCell = Array(600); //fills the barrier with a density of 600
        }
    }
}
//function to find the coordinates for the current mouse position
function getMousePos(e) {
    let rect = simulationHTML.canvas.getBoundingClientRect();
    return {
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top)
    };
}

/**
 * Code controls how the button looks (css stuff)
 */
let insertingBarriers = 0;
let insertBarrierToggle = () => {
    if (insertingBarriers === 0) {
        insertingBarriers = 1;
        simulationHTML.canvas.classList.add("insertBarrierCursor");
        simulationHTML.insertBarrierButton.classList.add("insertBarriersActive");
        simulationHTML.insertBarrierButton.innerHTML = "Done inserting";
        simulationHTML.startSimButton.disabled = true;
    }
    else {
        insertingBarriers = 0;
        simulationHTML.canvas.classList.remove("insertBarrierCursor");
        simulationHTML.insertBarrierButton.classList.remove("insertBarriersActive");
        simulationHTML.insertBarrierButton.innerHTML = "Insert Barriers";
        simulationHTML.startSimButton.disabled = false;
    }
}

//translates row and column to id
function coordsToId(row, col){
    if(row in arenaCellId && col in arenaCellId[row])
        return arenaCellId[row][col];
}

/**
 * translates the id to the coresponding row and column
 */
function idToCoords(id){
    return [simulationData.simulationArena[id].row, simulationData.simulationArena[id].col];
}

let arenaCellId = []; //Multidimensional array containing ids of the cells (basically a copy of the html arena)

//Switch case, which initializes the event data based on the chosen event.
function generateArena(chosenEvent) {
    arenaCellId = [];
    switch (chosenEvent) {
        case "hajj":
            chosenEventData.arena = hajjData.arena;
            chosenEventData.entryPoints = hajjData.entry;
            chosenEventData.startGoals = hajjData.startGoal
            chosenEventData.simulationGoals = hajjData.simulationGoalsId;
            chosenEventData.directionalGoals = hajjData.directionalId;
            chosenEventData.endGoals = hajjData.exit;
            chosenEventData.weightStartAndEnd = 0;
            chosenEventData.weightSimulationGoal = 1;
            chosenEventData.weightDirectionalEndGoal = 1;
            chosenEventData.spawnInterval = 10;
            chosenEventData.movementInterval = 10;
            chosenEventData.timeout = 100;
            chosenEventData.spawnQuantity = 100;
            chosenEventData.numberOfColumns = hajjData.numberOfColumns;
            chosenEventData.numberOfRows = hajjData.numberOfRows;
            break;
        case "loveParade":
            chosenEventData.arena = loveParadeData.arena;
            chosenEventData.entryPoints = loveParadeData.entry;
            chosenEventData.startGoals = loveParadeData.startGoal
            chosenEventData.simulationGoals = loveParadeData.simulationGoalsId;
            chosenEventData.directionalGoals = loveParadeData.directionalId;
            chosenEventData.endGoals = loveParadeData.exit;
            chosenEventData.weightStartAndEnd = 1;
            chosenEventData.weightSimulationGoal = 3;
            chosenEventData.weightDirectionalEndGoal = 1;
            chosenEventData.spawnInterval = 10;
            chosenEventData.movementInterval = 15;
            chosenEventData.timeout = 500;
            chosenEventData.spawnQuantity = 20;
            chosenEventData.numberOfColumns = loveParadeData.numberOfColumns;
            chosenEventData.numberOfRows = loveParadeData.numberOfRows;
            simulationHTML.canvas.className = "loveParade";
            break;
        case "itaewon":
            chosenEventData.arena = itaewonData.arena;
            chosenEventData.entryPoints = itaewonData.entry;
            chosenEventData.startGoals = itaewonData.startGoal
            chosenEventData.simulationGoals = itaewonData.simulationGoalsId;
            chosenEventData.directionalGoals = itaewonData.directionalId;
            chosenEventData.endGoals = itaewonData.exit;
            chosenEventData.weightStartAndEnd = 10;
            chosenEventData.weightSimulationGoal = 5;
            chosenEventData.weightDirectionalEndGoal = 10;
            chosenEventData.spawnInterval = 10;
            chosenEventData.movementInterval = 10;
            chosenEventData.timeout = 0;
            chosenEventData.spawnQuantity = 60;
            chosenEventData.numberOfColumns = itaewonData.numberOfColumns;
            chosenEventData.numberOfRows = itaewonData.numberOfRows;
            break;
        default:
            throw(404);
    }
    //Fits the canvas to the event size
    simulationHTML.canvas.width = chosenEventData.numberOfColumns;
    simulationHTML.canvas.height = chosenEventData.numberOfRows;
    //updates the context to canvas
    simulationHTML.ctx = document.getElementById("canvas").getContext("2d");
    simulationHTML.ctx.imageSmoothingEnabled = false;
    let id = 0;
    for (let i = 0; i < chosenEventData.numberOfRows; i++) { // loop for every row in arena
        arenaCellId.push([])
        for (let j = 0; j < chosenEventData.numberOfColumns; j++) { // loop for every column in arena
            arenaCellId[arenaCellId.length - 1].push(id);
            if (chosenEventData.arena[i][j] === 500) {
                simulationHTML.ctx.fillStyle = "#c5c5c5";
                simulationHTML.ctx.fillRect(j, i, 1, 1); //Draws the arena and fills the "building" pixels with the color grey
                simulationData.simulationArena.push(new cell(i, j, id, Array(500))); //sets the density of the building to 500
            }
            else {
                simulationData.simulationArena.push(new cell(i, j, id, []));
            }
            id++;
        }
    }
    //265
    // let string  = "";
    // for (let i = 225; i < 245; i++) {
    //     for (let j = 0; j < 45; j++) {
    //         if (chosenEventData.arena[i][j] === 0){
    //             string += coordsToId(i,j) + ","
    //         }
    //     }
    //     string += "\n"
    // }
    //console.log(string);
     /*for (let i = 0; i < chosenEventData.startGoals.length; i++) {
         simulationHTML.ctx.fillStyle = "#ff00b7";
         let startGoalCoordsIt = idToCoords(chosenEventData.startGoals[i]);
         simulationHTML.ctx.fillRect(startGoalCoordsIt[1], startGoalCoordsIt[0], 1, 1);
         //simulationHTML.ctx.fillRect(i, 255, 1, 1);
     }*/
}