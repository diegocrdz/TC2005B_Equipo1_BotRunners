/*
 * Chronometer to measure the time elapsed in the game
 * Reference: https://youtu.be/nO53--j1bDM?feature=shared
*/

class Chronometer {
    constructor() {
        this.$elapsedTime = document.querySelector("#elapsedTime"); //reference to the element in the html
        this.idInterval = 0; //id of the interval
        this.initialTime = null; //initial time
        this.temporaryDifference = 0; //temporary difference
        this.init(); //initiates the chronometer

        // Arrow function to refresh the displayed time
        this.refreshTime = () => {

            // if the initial time is not set, do nothing
            if (!this.initialTime) {
            return;
            }
            // Get the current time
            const now = new Date();
            // Calculate the difference between the current time and the initial time
            const difference = now.getTime() - this.initialTime.getTime();
            
            // Update the elapsed time element in minutes and seconds
            this.$elapsedTime.textContent = this.secondsToMinutes(Math.floor(difference / 1000));
        }
    }
        
    addZeros(value) {
        // If the value is less than 10, add a 0 before the value
        if (value < 10){ 
            return "0" + value;
        } else{
            return "" + value;
        }
    }

    secondsToMinutes(seconds) {
        const minutes = Math.floor(seconds / 60); // Calculates the minutes
        seconds = seconds % 60; // Calculates the seconds
        return `${this.addZeros(minutes)}:${this.addZeros(seconds)}`; 
    }

    start(){
        const now =  new Date(); // Get the current time
        this.initialTime = new Date(now.getTime() - this.temporaryDifference); // Set the initial time
        clearInterval(this.idInterval); 
        // Set the interval to refresh the time every second
        this.idInterval = setInterval(this.refreshTime, 1000);
    }

    pause(){
        // Calculates the temporary difference
        this.temporaryDifference = new Date().getTime() - this.initialTime.getTime();
        clearInterval(this.idInterval); 
    }
    

    reset(){
        clearInterval(this.idInterval);
        this.temporaryDifference = 0;
        this.init(); //resets the time by calling init
    }

    init(){
        // Initiates the time
        this.$elapsedTime.textContent = "00:00";
    }
}
