import {simulationData, createPerson, chosenEventData, simulationHTML} from "./simulation.js";
import { insertPeopleIntervalId } from "./startStopSim.js";
import { createPeopleTimeStamp } from "./results.js";
import { aStar } from "./aStar.js";
export {makePeople, insertPeople, movePeople}

let avoidBarriers = (cellIdArr) => {
    let passedCellId = cellIdArr[Math.floor(Math.random() * cellIdArr.length)];
    if (simulationData.simulationArena[passedCellId].peopleInCell.length === 600) {
        return avoidBarriers(cellIdArr);
    }
    else {
        return passedCellId;
    }
}

//Function creating a new person and placing them at the end of the array containg every person.
let makePeople = () => {
    for (let i = 0; i < simulationData.amountOfPeople; i++) {
        simulationData.people.push(new createPerson);
    }
}
let moveCurrentPerson = (currentPerson, i, moveToSquare) => {
    
}
let movePeople = (currentPerson, i) => {
    // console.log(currentPerson.currentSquare);
    // console.log(currentPerson.goalQueue);
    //console.log(currentPerson.goalNumber);
    let moveToSquare = aStar(currentPerson.currentSquare,
        currentPerson.goalQueue[currentPerson.goalNumber][0],
        currentPerson.goalQueue[currentPerson.goalNumber][1]); //This is the weight
    
    //console.log(moveToSquare);
    if (moveToSquare === -1 && currentPerson.goalNumber === currentPerson.goalQueue.length-1) {
        removePeople(i);
    } else {
        if (moveToSquare === -1) {
            do {
                currentPerson.goalNumber++;
                moveToSquare = aStar(currentPerson.currentSquare,
                    currentPerson.goalQueue[currentPerson.goalNumber][0],
                    currentPerson.goalQueue[currentPerson.goalNumber][1]); //This is the weight
            }
            while(moveToSquare === -1);
        }
        //removes currentPerson from the square they are currently at
        simulationData.simulationArena[currentPerson.currentSquare].peopleInCell
        .splice(simulationData.simulationArena[currentPerson.currentSquare].peopleInCell.indexOf(i), 1);
        //updates the color of the square
        colorOfDensity(simulationData.simulationArena[currentPerson.currentSquare]);

        currentPerson.currentSquare = moveToSquare;
        //adds the person to the new square
        //console.log("current square" + currentPerson.currentSquare)
        simulationData.simulationArena[currentPerson.currentSquare].peopleInCell.push(i);
        //updates the color of the new square
        colorOfDensity(simulationData.simulationArena[currentPerson.currentSquare]);
    }
}
let insertPeople = () => {
    //checks if all the people has been generated
    if (simulationData.amountOfPeopleGenerated === parseInt(simulationData.amountOfPeople)) {
        //stops generating people
        clearInterval(insertPeopleIntervalId);
        createPeopleTimeStamp();
        console.log("Stopped Generating People");     
    }

    //a random number is initialized. random ∈ {0;spawnQuantity}
    let random = Math.floor(Math.random() * chosenEventData.spawnQuantity); 
    //checks if the amount of people limit will be exceeded
    if (random + simulationData.insertionCounter > simulationData.amountOfPeople) {
        //random is set to be the remaining amount of people to be generated
        random = simulationData.amountOfPeople - simulationData.insertionCounter;
    }
    //Initializes every persons goal and the arena.
    //the for loop runs a random amount of times, 
    //but makes sure no duplicates are made by increasing simulationData.insertionCounter with the amount of people generated 
    //after each completion of the loop
    for (let i = simulationData.insertionCounter; i < random + simulationData.insertionCounter; i++) {
        //all goals are assigned through the avoidBarriers function, which ensures a goal cannot be set if it is a barrier
        simulationData.people[i].currentSquare = avoidBarriers(chosenEventData.entryPoints);

        switch (simulationData.chosenEvent) {
            case ("hajj"):
                simulationData.people[i].goalQueue.push(
                    [avoidBarriers(chosenEventData.startGoals),chosenEventData.weightStartAndEnd],
                    [avoidBarriers(chosenEventData.simulationGoals),chosenEventData.weightSimulationGoal],
                    [avoidBarriers(chosenEventData.endGoals),chosenEventData.weightStartAndEnd]);
                break;
            case ("loveParade"):
                let directionalGoalTemp;
                let simulationGoalTemp = avoidBarriers(chosenEventData.simulationGoals);
                //Math.round(Math.random)
                simulationData.people[i].goalQueue.push([avoidBarriers(chosenEventData.startGoals),chosenEventData.weightStartAndEnd])
                switch (true) {
                    //if the entrypoint's column is before the 70th column, the startGoal is chosen randomly from the left startgoals
                    //155, 255
                    case (simulationData.simulationArena[simulationGoalTemp].row < 255 && simulationData.simulationArena[simulationGoalTemp].col <= 70):
                        directionalGoalTemp = avoidBarriers(chosenEventData.directionalGoals[0]);
                        simulationData.people[i].goalQueue.push([directionalGoalTemp,chosenEventData.weightDirectionalEndGoal]);
                        break;
                    case (simulationData.simulationArena[simulationGoalTemp].row < 255 && simulationData.simulationArena[simulationGoalTemp].col > 70):
                        directionalGoalTemp = avoidBarriers(chosenEventData.directionalGoals[1]);
                        simulationData.people[i].goalQueue.push([directionalGoalTemp,chosenEventData.weightDirectionalEndGoal]);
                        break;
                    case (simulationData.simulationArena[simulationGoalTemp].row >= 255 && simulationData.simulationArena[simulationGoalTemp].col <= 70):
                        directionalGoalTemp = avoidBarriers(chosenEventData.directionalGoals[2]);
                        simulationData.people[i].goalQueue.push([directionalGoalTemp,chosenEventData.weightDirectionalEndGoal]);
                        break;
                    case (simulationData.simulationArena[simulationGoalTemp].row >= 255 && simulationData.simulationArena[simulationGoalTemp].col > 70):
                        directionalGoalTemp = avoidBarriers(chosenEventData.directionalGoals[3]);
                        simulationData.people[i].goalQueue.push([directionalGoalTemp,chosenEventData.weightDirectionalEndGoal]);
                        break;
                    /*default:
                        directionalGoalTemp = avoidBarriers(chosenEventData.directionalGoals[Math.round(Math.random())+2]);
                        simulationData.people[i].goalQueue.push([directionalGoalTemp,chosenEventData.weightDirectionalEndGoal]);
                        break;*/
                }
                simulationData.people[i].goalQueue.push(
                    [simulationGoalTemp,chosenEventData.weightSimulationGoal], 
                    [directionalGoalTemp,chosenEventData.weightDirectionalEndGoal],
                    [avoidBarriers(chosenEventData.startGoals),chosenEventData.weightStartAndEnd],
                    [avoidBarriers(chosenEventData.endGoals),chosenEventData.weightStartAndEnd]);
                break;
            case ("itaewon"):
                //the startGoals in itaewon is determined based on where the entry point is
                let tempGoalQueue;
                switch (true) {
                    //if the entrypoint's column is before the 70th column, the startGoal is chosen randomly from the left startgoals
                    case (simulationData.simulationArena[simulationData.people[i].currentSquare].col < 70):
                        tempGoalQueue = [avoidBarriers(chosenEventData.startGoals[0]),chosenEventData.weightStartAndEnd];
                        break;
                    case (simulationData.simulationArena[simulationData.people[i].currentSquare].col >= 70 && simulationData.simulationArena[simulationData.people[i].currentSquare].col < 160):
                        tempGoalQueue = [avoidBarriers(chosenEventData.startGoals[1]),chosenEventData.weightStartAndEnd];
                        break;
                    case (simulationData.simulationArena[simulationData.people[i].currentSquare].col >= 160):
                        tempGoalQueue = [avoidBarriers(chosenEventData.startGoals[2]),chosenEventData.weightStartAndEnd];
                        break;
                }
                simulationData.people[i].goalQueue.push(tempGoalQueue);
                let endGoalTemp = avoidBarriers(chosenEventData.endGoals);

                simulationData.people[i].goalQueue.push([avoidBarriers(chosenEventData.simulationGoals),chosenEventData.weightSimulationGoal])
                switch (true) {
                    case (simulationData.simulationArena[endGoalTemp].col < 70):
                        simulationData.people[i].goalQueue.push([avoidBarriers(chosenEventData.directionalGoals[0]),chosenEventData.weightDirectionalEndGoal]);
                        break;
                    case (simulationData.simulationArena[endGoalTemp].col >= 70 && simulationData.simulationArena[endGoalTemp].col < 160):
                        simulationData.people[i].goalQueue.push([avoidBarriers(chosenEventData.directionalGoals[1]),chosenEventData.weightDirectionalEndGoal]);
                        break;
                    case (simulationData.simulationArena[endGoalTemp].col >= 160):
                        simulationData.people[i].goalQueue.push([avoidBarriers(chosenEventData.directionalGoals[2]),chosenEventData.weightDirectionalEndGoal]);
                        break;
                }
                simulationData.people[i].goalQueue.push([endGoalTemp,chosenEventData.weightStartAndEnd]);
                break;
            default:
                throw new Error("Missing Event");
        }
        //each person is inserted into a random startingSquare
        simulationData.simulationArena[simulationData.people[i].currentSquare].peopleInCell.push(i);
        //the color of the square is updated
        colorOfDensity(simulationData.simulationArena[simulationData.people[i].currentSquare]);

        simulationData.amountOfPeopleInSim++
        simulationData.amountOfPeopleGenerated++;
    }
    
    simulationData.insertionCounter += random;
}
//Function to remove a person when they have reached their end goal.
let removePeople = (personIndex) => {
    //removes the person from the simulationArena array
    simulationData.simulationArena[simulationData.people[personIndex].currentSquare].peopleInCell.splice(simulationData.simulationArena[simulationData.people[personIndex].currentSquare].peopleInCell.indexOf(personIndex), 1);
    
    simulationData.people[personIndex].currentSquare = null;
    simulationData.people[personIndex].status = "Removed";
    
    simulationData.amountOfPeopleInSim--
    simulationData.removePeopleCounter++;
}

//visual representation of density
let colorOfDensity = (square) => {
    let color;
    switch (square.peopleInCell.length) {
        case 0:
            color = "#ffffff";
            break;
        case 1:
            color = "#1163FD";
            break;
        case 2:
            color = "#30ccf7";
            break;
        case 3:
            color = "#37f897";
            break;
        case 4:
            color = "#60f829";
            break;
        case 5:
            color = "#bff33a";
            break;
        case 6:
            color = "#ffc916";
            break;
        case 7:
            color = "#f16d20";
            break;
        case 8:
            color = "#f71616";
            break;
        case 9:
            color = "#690202";
            break;
        default:
            color = "#000000";
            break;
    }
    simulationHTML.ctx.fillStyle = color;
    simulationHTML.ctx.fillRect(square.col, square.row, 1, 1);
}
