import { simulationData } from "./simulation.js";
import { createTimeStamps, createDensityTimeStamps } from "./results.js";
export { moveOrNot, findMaxDensities}

//Function determining the probabilty of death at the current density in a cell, as well as updating a person status if they die.
let deathRisk = (person) => {
    //a random number between 0 and 9999 is chosen
    let deathRoll = Math.floor(Math.random() * 10000);
    let deathRisk = simulationData.simulationArena[person.currentSquare].peopleInCell.length - 7;
    /**
     * If statement functions as the probability of a person being marked for death. people dying risk = (1.4^n)/10000
     */
    if (deathRoll <= Math.pow(1.4,deathRisk)) {
        //since person has to injured before they can die: people dying risk = (1.4^n)/10000 * risk of injury
        if (person.status === "Injured") {
            person.status = "Dead";
            simulationData.deathCounter++;
            simulationData.injuredCounter--;
            simulationData.amountOfPeopleInSim--;
            createTimeStamps(simulationData.deathCounter, "death");
        }
    }
}
//Function determining the probabilty of injury at the current density in a cell, as well as updating a persons status if they get injured.
let injuryRisk = (person) => {
    let injuryRoll = Math.floor(Math.random() * 10000);
    let injuryRisk = simulationData.simulationArena[person.currentSquare].peopleInCell.length - 6;
    //works the same as the deathRisk function. risk of injury = (2^n)/10000
    if (injuryRoll <= Math.pow(1.1,injuryRisk)) {
        if((person.status === "Healthy" && person.status !== "Dead")) {
            person.status = "Injured";
            simulationData.injuredCounter++;
            createTimeStamps(simulationData.injuredCounter, "injured");
        }
    }
}

/**
 * Determines if the person can move, if they can, they have a risk of dying and getting injured before moving away.
 * @param {looped through in startStopSim.js where person is all people from 0 to people.length} person 
 * @returns 
 */
let moveOrNot = (person) => {
    if (person.status === "Dead" || person.status === "Removed") {
        return false;
    }
    else{
        deathRisk(person);
        injuryRisk(person);
        return true;
    }
}

/**
 * Before each person is moved, the density of their square is logged if the density is higher than previously logged.
 */
let findMaxDensities = (person, i) => {
    if(person.status !== "Removed") {
        let densityInSquare = simulationData.simulationArena[person.currentSquare].peopleInCell.length;
        if (i === 0) {
            simulationData.currentMaxDensity = 0; //The value is reset every time all people have moved
        } 
        if ( densityInSquare > simulationData.currentMaxDensity) {
            simulationData.currentMaxDensity = densityInSquare;
        }
        if (simulationData.currentMaxDensity > simulationData.maxDensityReached) {
            //maxDensityReached will only be reset when running resetSimulation
            simulationData.maxDensityReached = simulationData.currentMaxDensity;
            createDensityTimeStamps();
        }
    }
}
