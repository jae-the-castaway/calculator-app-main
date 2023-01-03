"use strict"
// variables for functionality
const display = document.querySelector('.current-operand');
const prevDisplay = document.querySelector('.previous-operand');

// variables for theme switch
const colorThemes = document.querySelectorAll('[name="theme"]');
const currentTheme = localStorage.getItem("theme");
const darkTheme = document.getElementById("dark");


// on load, set theme to previous theme using localstorage
function setTheme() {
    colorThemes.forEach((theme) =>{
        if (currentTheme === theme.id) {
            theme.checked = true;
        }
    });
}

// when click, toggle theme class and set local storage
colorThemes.forEach((theme) => {
    theme.addEventListener("click", () => {
        document.body.className = theme.id;
        theme.checked = true;
        localStorage.setItem("theme", theme.id )
    })
})

// on load, fire setTheme function
document.onload = setTheme();




// listen to key-presses

const calculator = document.querySelector(".calculator");
const keys = document.querySelector(".calculator-keys");


keys.addEventListener('click', e => {
 const key = e.target;
 const action = key.dataset.action;
 const keyContent = key.textContent;
 const displayedNum = display.textContent;
 const prevDisplayedNum = prevDisplay.textContent;
 const previousKeyType = calculator.dataset.previousKeyType;

    if (key.matches('button')) {
        if (!action) {
            calculator.dataset.previousKeyType = 'number'
            if( displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.textContent = keyContent;
            } else {
                display.textContent += keyContent;
            }
        }
        if ( action === 'add' ||
             action === 'subtract' ||
             action === 'multiply' ||
             action === 'divide') {
                calculator.dataset.previousKeyType = 'operator';

                const firstValue = calculator.dataset.firstValue
                const operator = calculator.dataset.operator;
                const secondValue = displayedNum;
                // add custom attributes
                calculator.dataset.operator = action
 
                if (previousKeyType !== 'operator') {

                    if (firstValue && operator) {
                        console.log(firstValue);
                        prevDisplay.textContent = calculate(firstValue, operator, secondValue) + keyContent;
                        display.textContent = 0;
                        calculator.dataset.firstValue = calculate(firstValue, operator, secondValue);
                    } else {
                        calculator.dataset.firstValue = displayedNum;
                        prevDisplay.textContent = displayedNum + keyContent;
                        display.textContent = 0;
                    }
                }
                
                if (previousKeyType === 'operator' && !prevDisplayedNum.includes(action)) {
                    prevDisplay.textContent = firstValue + keyContent
                }
                

             }

        if (action === 'decimal') {
            calculator.dataset.previousKeyType = 'decimal'
            // Do nothing if string has a dot
            if (!displayedNum.includes('.')) {
                display.textContent = displayedNum + '.'
            } else if (
                previousKeyType === 'operator' ||
                previousKeyType === 'calculate') {
                    display.textContent = '0.'
                }
        }
        if (action === 'delete') {
            calculator.dataset.previousKeyType = 'delete'
            display.textContent = display.textContent.slice(0, -1)
        }
        if (action === 'reset') {
            calculator.dataset.previousKeyType = 'reset'
            calculator.dataset.firstValue = ''
            calculator.dataset.modValue = ''
            calculator.dataset.operator = ''
            calculator.dataset.previousKeyType = ''
            prevDisplay.textContent = 0
            display.textContent = 0
        }
        if (action === 'calculate') {

            let firstValue = calculator.dataset.firstValue
            const operator = calculator.dataset.operator
            let secondValue = displayedNum

            if (firstValue && displayedNum) {
                if (previousKeyType === 'calculate') {
                    firstValue = displayedNum
                    secondValue = calculator.dataset.modValue
                }
                prevDisplay.textContent = ''
                display.textContent = calculate(firstValue, operator, secondValue)
            }
            // set custom attributes
            calculator.dataset.previousKeyType = 'calculate'
            calculator.dataset.modValue = secondValue
        }
    } 

});

// calculate function

const calculate = (n1, operator, n2) => {
    let result = ''
    
    if (operator === 'add') {
      result = parseFloat(n1) + parseFloat(n2)
    } else if (operator === 'subtract') {
      result = parseFloat(n1) - parseFloat(n2)
    } else if (operator === 'multiply') {
      result = parseFloat(n1) * parseFloat(n2)
    } else if (operator === 'divide') {
      result = parseFloat(n1) / parseFloat(n2)
    }
    
    return result
  }