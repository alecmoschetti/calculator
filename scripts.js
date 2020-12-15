
//global variables go here

//query selectors here 
const overlay = document.querySelector(".overlay");
const infoButton = document.querySelector(".info");
const modalClose = document.querySelector(".modalClose");
const buttons = document.querySelectorAll("button");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const fxs = document.querySelectorAll(".fx");
const equal = document.querySelector("#equal");
const ac = document.querySelector(".clearAllButton");
const ce = document.querySelector("#backspace");
const screen = document.querySelector(".screenContent");
const modes = document.querySelectorAll(".mode");
const info = document.querySelector(".info");
let displayCurrent = screen.querySelector(".input");
let displayPrevious = screen.querySelector(".previous");

//variables to be manipulated with event delegation
let input = [];
let answerStorage = [];
let mathInProgress = [];
let signArr = [];
let finalInput;

// global functions go here

//helper functions

function click(e) { //allows for repeated click animations to fire
    e.target.classList.remove('click'); 
    e.target.offsetHeight; 
    e.target.classList.add('click');
}

const update = (choice, string) => choice.innerHTML = `${string}`; //was tired of constantly writing element.innerHTML = `something I wanted to display`. not much easier, but easier to look at, less bloat
const isSoloOp = op => /x!|ln|log|sin|cos|tan|√/ig.test(op); //regex for solo operands
const reducer = (acc, cur) => acc + cur; //function expression for a simple reduce method to display number inputs
const operate = (callback, a, b) => { //our main math function that handles with specific math callback operation to do and our parameters
    let doMath = callback(a, b);
    if (! Number.isInteger(doMath)) doMath = round(doMath, 2); //rounding our answer if it's a huge int
    answerStorage.push(doMath); //pushing our answer into the answerStorage array
    update(displayCurrent, `${answerStorage.slice(-1)[0]}`); //update display
    mathInProgress = []; //reset our mathInProgress array
};

function checkFirst(e) { //function that checks if this is our first calculation done when the user clicks an operator button. stupid name I know...sorry
    let a;
    let sign = e.target.innerHTML; //need this for the upper display

    if (answerStorage.length === 1) { //essentially letting the calculator continue to do math without pressing the equal button
        a = `${answerStorage.slice(-1)[0]}`; //take the number in our answerStorage
        update(displayPrevious, `${a} ${sign}`);
        mathInProgress.push(a); //push it into our mathInProgress array to do stuff with it
        answerStorage = []; //reset answerStorage
    }
}

function clearAll() { //clears all array variables and resets the display and hides the previous display
    input = [];
    finalInput = '';
    answerStorage = [];
    mathInProgress = [];
    signArr = [];
    update(displayCurrent, finalInput);
    update(displayPrevious, finalInput);
    displayPrevious.classList.add('hidden');
}

function isItDefined(sign = undefined) { //function to make sure we aren't pushing undefined into the mathInProgress array. was happening a lot somehow.
    if (finalInput !== undefined) mathInProgress.push(finalInput);
    finalInput = undefined; //after finalInput is pushed into the mathInProgress array, set it to undefined
    input = []; //input array is also cleared
    signArr.push(sign); //store the operator that was clicked into the sign array
}

function equalSwitch(sign, a, b) { //massive if else statement that activates one of the two switch statements that determines what mathematical function to perform on our a and b arguments
    if (a !== undefined && b !== undefined && a !== "") { //checking to see if this is a two number operation
        switch (true) { //in each case we update the display and perform the proper mathematical function on our a and b arguments
            case sign === "+":
                update(displayPrevious, `${a} ${sign} ${b}`);
                operate(add, +a, +b);
                break;
            case sign === "−":
                update(displayPrevious, `${a} ${sign} ${b}`);
                operate(subtract, +a, +b);
                break;
            case sign === "×":
                update(displayPrevious, `${a} ${sign} ${b}`);
                operate(multiply, +a, +b);
                break;
            case sign === "÷":
                (+a === 0 || +b === 0)
                ? update(displayCurrent, `Insufficient data for meaningful answer.`)
                : operate(divide, +a, +b);
                update(displayPrevious, `${a} ${sign} ${b}`);
                break;
            case sign === "^":
                update(displayPrevious, `${a}^${b}`);
                operate(power, +a, +b);
                break;
            case sign === "%":
                update(displayPrevious, `${a}${sign} of ${b}`);
                operate(percent, +a, +b);
                break;
            case sign === "<sup>y</sup>√x":
                update(displayPrevious, `<sup>${a}</sup>√x(${b})`);
                operate(powrt, +a, +b);
                break;
        }
    } else { //one number operations only
        let activeMode = document.querySelector(".active"); //deteriming which mode (rad or deg) is currently selected
        let convert = degToRad(+b); //function on line 195, in case of sin/cos/tan operation. won't effect the other operations
        mathInProgress = []; //empty mathInProgress array now for the future, so they can push the answer into it so user can continue to do math with it
        update(displayPrevious, `${sign}(${b})`); //update the previous display to what our operation is performing
        switch (true) {
            case sign === "sin":
                if (activeMode.id === "degrees") {
                    update(displayCurrent, sin(convert).toFixed(2));
                    mathInProgress.push(sin(convert).toFixed(2));
                } else if (activeMode.id === "radian") {
                    update(displayCurrent, sin(+b).toFixed(2));
                    mathInProgress.push(sin(+b).toFixed(2));
                }
                break;
          case sign === "cos":
                if (activeMode.id === "degrees") {
                    update(displayCurrent, cos(convert).toFixed(2));
                    mathInProgress.push(cos(convert).toFixed(2));
                } else if (activeMode.id === "radian") {
                    update(displayCurrent, cos(+b).toFixed(2));
                    mathInProgress.push(cos(+b).toFixed(2));
                }
                break;
          case sign === "tan":
                if (activeMode.id === "degrees") {
                    update(displayCurrent, tan(convert).toFixed(2));
                    mathInProgress.push(tan(convert).toFixed(2));
                } else if (activeMode.id === "radian") {
                    update(displayCurrent, tan(+b).toFixed(2));
                    mathInProgress.push(tan(+b).toFixed(2));
                }
                break;
            case sign === "x!":
                if (+b < 0) { //doesn't accept negative numbers
                    clearAll();
                    update(displayCurrent, `Insufficient data for meaningful answer.`);
                } else if (factorial(+b) > Number.MAX_SAFE_INTEGER) { //number is too big (I believe anything over 19 is too big) to display
                    clearAll();
                    update(displayCurrent, `Insufficient data for meaningful answer.`);
                } else {
                    let roundedFactorial = factorial(+b).toFixed(2)
                    mathInProgress.push(+roundedFactorial);
                    update(displayPrevious, `${sign}(${b})`);
                    update(displayCurrent, roundedFactorial);
                }
                break;
            case sign === "ln":
                update(displayCurrent, ln(+b).toFixed(2));
                mathInProgress.push(ln(+b).toFixed(2));
                break;
            case sign === "log":
                update(displayCurrent, log(+b).toFixed(2));
                mathInProgress.push(log(+b).toFixed(2));
                break;
            case sign === "√":
                if (+b < 0) {
                    update(displayCurrent, `Insufficient data for meaningful answer`);
                } else {
                    update(displayCurrent, sqrt(+b).toFixed(2));
                    mathInProgress.push(sqrt(+b).toFixed(2));
                    break;
                }
        }
    }
}

//actual math calculation functions 
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const power = (a, b) => Math.pow(a, b);
const sin = n => Math.sin(n);
const cos = n => Math.cos(n);
const tan = n => Math.tan(n);
const ln = n => Math.log(n);
const log = n => Math.log10(n);
const sqrt = n => Math.sqrt(n);
const powrt = (a, b) => Math.pow(b, 1/a);
const percent = (a, b) => ((a / 100) * b).toFixed(2);
const degToRad = deg => deg * Math.PI / 180; 
const factorial = (n, ...rest) => {
	if (n == 0) {
        return 1;
    } else if (rest) {
	let product = 1;
	for ( let i = n; i > 0; i-- ) {
		product *= i;
    }
    return product;
    }
}

//from MDN's page but I made it into an arrow function
const random = (min, max) => round(Math.random() * (max - min) + min, 0);
//gonna pass it as an argument to fiborng

//using the fibonacci function I came up with in an earlier odinproject challenge to generate a pseudorandom number
const fiborng = (num) => {
    let phi = ((1 + Math.sqrt(5))/2);
    if (num === 1) return 1; 
    if (Math.sign(num) === -1 ) return `OOPS`;
    return ((Math.pow(phi, num) - Math.pow(1 - phi, num))/Math.sqrt(5));
};

// got this rounding function from an answer over at stack overflow 
// https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
const round = (value, decimals) => Number(Math.round(value+'e'+decimals)+'e-'+decimals);

//event handlers go here **********************************************************************************

// my event listeners to let the user repeat a click on a button and still get an animation
buttons.forEach(button => button.addEventListener('click', (e) => { 
    click(e);
}));

info.addEventListener("click", (e) => {
    click(e);
});

//modal window event listeners
infoButton.addEventListener("click", () => {
    overlay.classList.toggle("hidden");
});

modalClose.addEventListener("click", () => {
    overlay.classList.toggle("hidden");
});

//mode picking event deg vs. radian 
modes.forEach(mode => mode.addEventListener("click", (e) => {
    let mode = e.target; //get which button was selected
    let activeMode = document.querySelector(".active"); //get the currently selected mode with the active class
    let modeDisplay = document.querySelector(".modeDisplay"); //get the display area in the top left screen
    if (!mode.classList.contains("active")) { //if button we just clicked isn't the active mode
        mode.classList.add("active"); //add active mode class
        activeMode.classList.remove("active"); //remove active mode class from the other one
        (modeDisplay.innerHTML === "Deg") ? modeDisplay.innerHTML = "Rad" : modeDisplay.innerHTML = "Deg"; //update the display
    }
}));

//ac event listener (clear all)
ac.addEventListener('click', () => {
clearAll();
});

//ce event listener (backspace)
ce.addEventListener('click', () => {
    input.pop(); //remove the last array element in the input array
    if (input.length >= 1) finalInput = input.reduce(reducer);//if input length is more than or equal to one perform the reducer function *see line 274*
    update(displayCurrent, finalInput); //update display to the new finalInput
});

//update input display event listener
// puts the numbers in the lower part of the calculator screen 
numbers.forEach(number => number.addEventListener('click', (e) => { //this fires everytime a number key is pressed
    let number = e.target.innerHTML; //get the specific number string in question
    input.push(number); //that number is then pushed into the input array
    finalInput = input.reduce(reducer); //using our reducer helper function to make all the individual number entries into one number
    update(displayCurrent, finalInput); //appending that number to the screen
}));

//listening for operand buttons;                                                         
operators.forEach(operator => operator.addEventListener('click', (e) => {
    displayPrevious.classList.remove('hidden'); 
    checkFirst(e); //function from line 52. checks if this is the first time we've pressed an operator key or not
    let a; //variable instancing a
    let b; //variable instancing b 
    let sign = e.target.innerHTML; //need this for the upper display
    let signID = e.target.id; //for comparisons
    isItDefined(sign); //function from line 74. makes sure we're only pushing valid data into the mathInProgress array. also resets input array and finalInput
    if (isSoloOp(sign)) { //if it's a solo operand button then don't do any of the below code blocks
        if (mathInProgress.length === 1) { 
            update(displayPrevious, `${sign} ${mathInProgress[0]}`); // except update the screen of course
        } else update(displayPrevious, sign); // except update the screen of course -----but do none of the code below this line in this event ---------------------
    } else if (mathInProgress.length === 1 ) { //not a solo operator pressed and mathInProgress array only holds one value
        update(displayPrevious, `${mathInProgress.slice(-1)[0]} ${sign}`); //update the display with that value and the sign pressed
    } else if (mathInProgress.length === 2) {  //not a solo operator and mathInProgress array holds two values
        let signInUse = signArr.slice(-1)[0];
        b = mathInProgress.pop(); //filling our variables created above with the values of our math array. b gets the most recent
        a = mathInProgress.pop(); //a gets the initial value in the array
        update(displayPrevious, `${a} ${signInUse} ${b}`); //update the display with the numbers and sign we are using
        switch (true) { //esentially a smaller version of our equal switch function from line 120
            case(signID === 'addition'): 
                operate(add, +a, +b);
                break;
            case(signID === 'subtraction'): 
                operate(subtract, +a, +b);
                break;
            case(signID === 'multiplication'): 
                operate(multiply, +a, +b);
                break;
            case(signID === 'division'): 
                (+a === 0 || +b === 0) ? update(displayCurrent, `Insufficient data for meaningful answer.`) : operate(divide, +a, +b);
                break;
            default:
                break;
        }
    }
}));

fxs.forEach(fx => fx.addEventListener('click', (e) => {
    displayPrevious.classList.remove('hidden'); // if the upper display is hidden, then remove the hidden class
    let fx = e.target.innerHTML; //which button was pressed
    let negate; //variables to be used in our first case
    let posi; //variables to be used in our first case
    switch (true) {
        case fx === "±":
            switch (true) {
                case (+finalInput > 0): //if input is positive
                    negate = -Math.abs(+finalInput); //make it negative
                    finalInput = negate;
                    update(displayCurrent, finalInput); //update the display
                    break;
                case (+finalInput < 0): //if input is negative
                    posi = Math.abs(+finalInput); //make it positive
                    finalInput = posi;
                    update(displayCurrent, finalInput); //update display
                    break;
                case (finalInput === undefined):  //if finalInput is undefined
                    finalInput = answerStorage.pop(); //grab the last value from the answerStorage array
                    if (+finalInput > 0) { //then repeat the above process on the that number but in an if else statement
                        negate = -Math.abs(+finalInput);
                        finalInput = negate;
                        update(displayCurrent, finalInput);
                    } else if (+finalInput < 0) {
                        posi = Math.abs(+finalInput);
                        finalInput = posi;
                        update(displayCurrent, finalInput);
                    }
                    break;
                }
            break;
        case fx === "π": //if pi was pressed
            finalInput = Math.PI; //make our final input pi
            update(displayCurrent, finalInput);
            break;
        case fx === "τ": //if tau was pressed
                finalInput = 2 * Math.PI; //make our final input tau
                update(displayCurrent, finalInput);
                break;
        case fx === "ℇ": //if euler's constant was pressed
            finalInput = Math.E; //make our final input euler's constant 
            update(displayCurrent, finalInput);
            break;
        case fx === "rndm": //if random was pressed 
            finalInput = Math.trunc(fiborng(random(2, 50))); //function from line 210 and 214 to generate a pseudorandom number and truncate it if it has crazy big/small values
            update(displayCurrent, finalInput);
            break;
      }
}));

equal.addEventListener('click', () => {
    displayPrevious.classList.remove('hidden');
    isItDefined(); //function defined in line 74 but essentially make sure we aren't pushing undefined into the mathInProgress array
    let a = mathInProgress.slice(-2, -1)[0];
    let b = mathInProgress.slice(-1)[0]; 
    let signNoEquals = signArr.filter(sign => (sign !== '=') ? sign : !sign); //we don't want actual equal signs in our math operation functions
    let sign = signNoEquals.slice(-1)[0];
    ((+a === 420 && +b === 69) || (+b === 420 && +a === 69)) ? alert(`😤💨🌿`): equalSwitch(sign, a, b); 
    //first half is a stupid easter egg, will probably remove. but the equalSwitch() with the proper parameters is the final step in the calculation
});

