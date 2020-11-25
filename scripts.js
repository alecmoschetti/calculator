//global variables go here

const buttons = document.querySelectorAll('button');
const screen = document.querySelector('.screenContent');
let display = screen.querySelector('span');
const ce = document.querySelector('.clearButton');
let input = [];

// global functions go here


//event handlers go here

// my event listener to let the user repeat a click on a button and still get an animation
buttons.forEach(button => button.addEventListener('click', (e) => { 
    e.target.classList.remove('click'); 
    e.target.offsetHeight; 
    e.target.classList.add('click');
}))

//ce event listener 
ce.addEventListener('click', () => {
    display.innerHTML = '0';
});

buttons.forEach(button => button.addEventListener('click', (e) => { 
    let button = e.target.innerHTML;
    if (button === 'Rad' || button === 'Deg' || button === 'CE' || button === 'Ans' || button === '=') {
        return;
    } else {
        display.innerHTML = '';
        display.innerHTML = button;
    }
}))



