class Chronometer{ //reference: https://youtu.be/nO53--j1bDM?feature=shared
    constructor() {
        this.$elapsedTime = document.querySelector("#elapsedTime"); //reference to the element in the html
        this.idInterval = 0; //id of the interval
        this.initialTime = null; //initial time
        this.temporaryDifference = 0; //temporary difference
        this.init(); //initiates the chronometer

        // Arrow function to refresh the displayed time
        this.refreshTime = () => {

            if (!this.initialTime) { // if the initial time is not set, do nothing
            return;
            }
            const now = new Date(); //get the current time
            const difference = now.getTime() - this.initialTime.getTime(); //calculates the difference between now and the initial time
            
            this.$elapsedTime.textContent = this.secondsToMinutes(Math.floor(difference / 1000)); //update the elapsed time element in minutes and seconds
        }
    }
        
    addZeros(value) {
        if (value < 10){ 
            return "0" + value; //if the value is less than 10, add a 0 before the value
        } else{
            return "" + value;
        }
    }

    secondsToMinutes(seconds) {
        const minutes = Math.floor(seconds / 60); //calculates the minutes
        seconds = seconds % 60; //calculates the seconds
        return `${this.addZeros(minutes)}:${this.addZeros(seconds)}`; 
    }

    start(){
        const now =  new Date(); //get the current time
        this.initialTime = new Date(now.getTime() - this.temporaryDifference); //set the initial time
        clearInterval(this.idInterval); 
        this.idInterval = setInterval(this.refreshTime, 1000); //set the interval to refresh the time every second
    }

    pause(){
        this.temporaryDifference = new Date().getTime() - this.initialTime.getTime(); //calculates the temporary difference
        clearInterval(this.idInterval); 
    }
    

    reset(){
        clearInterval(this.idInterval);
        this.temporaryDifference = 0;
        this.init(); //resets the time by calling init
    }

    init(){
        this.$elapsedTime.textContent = "00:00"; //initiates the time
    }
}
