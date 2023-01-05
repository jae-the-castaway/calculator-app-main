"use strict"
// variables for event listener
const calculator = document.querySelector(".calculator");
const display = document.querySelector('.current-operand');
const subDisplay = document.querySelector('.previous-operand');
const keys = document.querySelector(".calculator-keys");
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

document.onload = setTheme(); // on load, fire setTheme function


// listen to key-presses
keys.addEventListener('click', e => {
    if (!e.target.matches('button')) return

    const key = e.target
    const displayedNum = display.textContent

    const resultString = createResultString(key, displayedNum, calculator.dataset)
    const subResultString = createSubResultString(key, displayedNum, calculator.dataset)
    
    subDisplay.textContent = subResultString
    display.textContent = resultString
    
    updateCalculatorState(key, displayedNum, calculator.dataset)
   });


const createResultString = (key, displayedNum, state) => {
    const keyType = getKeyType(key)
    const keyContent = key.textContent
    const {firstValue,
            modValue,
            operator,
            previousKeyType} = state

    if (keyType === 'number') {
        return displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate'
        ? keyContent 
        : displayedNum + keyContent
    }
    if (keyType === 'decimal') {
        calculator.dataset.previousKeyType = 'decimal'
        if (!displayedNum.includes('.')) return displayedNum + '.' //if it has already decimal, do nothing
        if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
        return displayedNum // block undefined
    }
    if (keyType === 'operator') {
            if (previousKeyType !== 'operator') return 0
            return displayedNum
        }
    if (keyType === 'delete') {
        if (displayedNum[1]) {
            return display.textContent.slice(0, -1)
        } else {return 0}
        
    }
    if (keyType === 'reset') {
        return 0
    }
    if (keyType === 'calculate') {
        return firstValue && displayedNum
        ? previousKeyType === 'calculate'
            ? calculate(displayedNum, operator, modValue)
            : calculate(firstValue, operator, displayedNum)
        :displayedNum
    }
}

const createSubResultString = (key, displayedNum, state) => {
    const keyType = getKeyType(key)
    const keyContent = key.textContent
    const {action} = key.dataset
    const {firstValue,
           operator,
           previousKeyType} = state

    if (keyType === 'number') {
        return subDisplay.textContent
    }
    if (keyType === 'operator') {
        if (previousKeyType === 'calculate') {
            return displayedNum + keyContent
        }
        if (previousKeyType !== 'operator') {
            return firstValue && operator 
            ? calculate(firstValue, operator, displayedNum) + keyContent
            : displayedNum + keyContent
        }

        if (previousKeyType === 'operator' && !subDisplay.textContent.includes(action)) return firstValue + keyContent
    }

    if (keyType === 'delete') {return subDisplay.textContent}
}

const updateCalculatorState = (key, displayedNum, state) => {
    const { previousKeyType,
            firstValue,
            modValue,
            operator
    } = state
    const {action} = key.dataset
    const keyType = getKeyType(key)
    calculator.dataset.previousKeyType = keyType
    
    if (keyType === 'number') { /* ... */ }
    if (keyType === 'decimal') { /* ... */ }
    if (keyType === 'operator') {            
        calculator.dataset.operator = action;

        if (previousKeyType !== 'operator') {
            calculator.dataset.firstValue = firstValue && operator ? calculate(firstValue, operator, displayedNum) : displayedNum
    }}
    if (keyType === 'delete') {calculator.dataset.previousKeyType = 'delete' }
    if (keyType === 'reset') {             
        calculator.dataset.previousKeyType = 'reset'
        calculator.dataset.firstValue = ''
        calculator.dataset.modValue = ''
        calculator.dataset.operator = ''
        calculator.dataset.previousKeyType = ''}
    if (keyType === 'calculate') {             
        calculator.dataset.previousKeyType = 'calculate'
        if (firstValue && displayedNum) {
            previousKeyType === 'calculate'
            ? calculator.dataset.firstValue = displayedNum
            : calculator.dataset.modValue = displayedNum
        }
  }
}

const getKeyType =  (key) => {
    const {action} = key.dataset
    if(!action) return 'number'
    if(action === 'add' ||
       action === 'subtract' ||
       action === 'multiply' ||
       action === 'divide'
       ) return 'operator'
       return action
}

const calculate = (n1, operator, n2) => {
    const firstNum = parseFloat(n1)
    const secondNum = parseFloat(n2)
    if (operator === 'add') return firstNum + secondNum
    if (operator === 'subtract') return firstNum - secondNum
    if (operator === 'multiply') return firstNum * secondNum
    if (operator === 'divide') return firstNum / secondNum
  }