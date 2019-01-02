'use strict';

var calculator = document.querySelector('.calculator');
var screen = calculator.querySelector('.screen');
var keys = calculator.querySelector('.keypad');

// Calculate function
function calculate(firstValue, operator, nextValue) {
    firstValue = parseFloat(firstValue);
    nextValue = parseFloat(nextValue);

    if (operator === "add")
        return firstValue + nextValue;
    else if (operator === "sub")
        return firstValue - nextValue;
    else if (operator === "mul")
        return firstValue * nextValue;
    else if (operator === "div")
        return firstValue / nextValue;
}

// Listen for clicks
// Either it is on buttons or screen
// If buttons, as usual, behave like buttons?
// If screen, copy the results into clipboard
keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        // Button (event.target)
        const btn = e.target;

        // Key as button contents
        const key = btn.textContent;

        // Action, if that button has dataset property
        const action = btn.dataset.action;

        let operatorOff = function() {
            for (let k of document.getElementsByTagName('button')) {
                if (k.classList.contains("pressed")) {
                    k.classList.remove("pressed");
                }
            }
        };

        let toggleClearButton = function(content) {
            const clearBtn = document.getElementById("clear");
            // Alternatively,
            // clearBtn = calculator.querySelector('[data-action=clear');
            clearBtn.textContent = content;
        };

        let firstValue, nextValue;
        // AC/CE button
        if (action === "clear") {
            screen.textContent = "0";

            // For AC button
            // Reset all the states
            if (key === "AC") {
                calculator.dataset.firstValue = "";
                calculator.dataset.nextValue = "";
                calculator.dataset.operator = "";
                calculator.dataset.lastAction = "";

                operatorOff();
            }
            // For CE button
            // Just clears the screen.textContent
            // Then converts to AC button unless another button is pressed
            // Switch off the operator button
            else if (key === "CE") {
                screen.textContent = "0";
                toggleClearButton("AC");

                calculator.dataset.lastAction = "clear-screen";
            }
        }
        else {
            // Operator: + - × ÷ buttons
            if (action === "add" || action === "sub" ||
                action === "mul" || action === "div") {
                // Switch off the operator button
                operatorOff();
                // Add this class "pressed" for styling
                btn.classList.add("pressed");

                const lastAction = calculator.dataset.lastAction;
                if (lastAction === "equal") {
                    calculator.dataset.firstValue = screen.textContent;
                    calculator.dataset.nextValue = "";
                }
                else if (lastAction !== "operator") {
                    const operator = calculator.dataset.operator;
                    if (operator) {
                        // Evaluate the results before setting new operator in action
                        firstValue = calculator.dataset.firstValue;
                        nextValue = screen.textContent;

                        screen.textContent = calculate(firstValue, operator, nextValue);
                    } else {
                        calculator.dataset.nextValue = "";
                    }

                    calculator.dataset.firstValue = screen.textContent;
                }

                calculator.dataset.operator = action;
                calculator.dataset.lastAction = "operator";
            }
            // Numbers: 0 1 2 3 4 5 6 7 8 9
            else if (!action) {
                const lastAction = calculator.dataset.lastAction;

                if (screen.textContent === "0" || lastAction === "operator" ||
                    lastAction === "equal") {
                    screen.textContent = key;
                } else {
                    screen.textContent += key;
                }

                calculator.dataset.lastAction = "number";
            }
            // Decimal button
            else if (action === "decimal") {
                const lastAction = calculator.dataset.lastAction;

                if (lastAction === "operator" || lastAction === "equal") {
                    screen.textContent = "0.";
                }
                else {
                    if (!screen.textContent.includes(".")){
                        screen.textContent += key;
                    }
                }

                calculator.dataset.lastAction = "decimal";
            }
            // Equal button
            else if (action === "equal") {
                const operator = calculator.dataset.operator;
                const lastAction = calculator.dataset.lastAction;

                /** Situations that will happen if pressing equal continuously:
                 *  1) (number) (operator) (=) : (number) (operator) (number)
                 *  2) (=) repeated: (result[n-1]) (operator) (number) = (result[n])
                 **/
                if (lastAction === "equal") {
                    if (operator) {
                        firstValue = calculator.dataset.firstValue;
                        nextValue = calculator.dataset.nextValue;

                        screen.textContent = calculate(firstValue, operator, nextValue);
                    } else {
                        calculator.dataset.nextValue = "";
                    }
                }
                /** For operators
                 *
                 **/
                else if (lastAction === "operator") {
                    firstValue = calculator.dataset.firstValue;

                    calculator.dataset.nextValue = screen.textContent;
                    nextValue = screen.textContent;

                    screen.textContent = calculate(firstValue, operator, nextValue);
                }
                // For pressing numbers, decimals and CE buttons
                else if (lastAction === "decimal" || lastAction === "number" ||
                         lastAction === "clear-screen") {
                    // If there is operator going on,
                    if (operator) {
                        nextValue = calculator.dataset.nextValue;
                        // Normally,
                        // (first [previously saved]) (operator) (next [display])
                        // If you directly pressed numbers then equal without touching
                        // operator, then it will be:
                        // (first [display]) (operator) (next [unchanged])
                        if (!nextValue) {
                            firstValue = calculator.dataset.firstValue;
                            calculator.dataset.nextValue = screen.textContent;
                            nextValue = screen.textContent;
                        } else {
                            firstValue = screen.textContent;
                        }

                        screen.textContent = calculate(firstValue, operator, nextValue);
                    } else {
                        // No operator is going on, just display the display value
                        screen.textContent = parseFloat(screen.textContent);
                        calculator.dataset.nextValue = "";
                    }
                }

                calculator.dataset.firstValue = screen.textContent;
                calculator.dataset.lastAction = "equal";
            }

            toggleClearButton("CE");
        }
    }
});

screen.addEventListener('click', e => {
    if (e.target.matches('.screen')) {
        if (screen.textContent) {
            // Tips on copying to clipboard:
            // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
            const temp = document.createElement('textarea');
            temp.value = screen.textContent;
            screen.appendChild(temp);
            temp.select();
            document.execCommand("Copy");
            screen.removeChild(temp);
        }
    }
});

document.getElementsByClassName('screen').onload = function() {
    calculator.dataset.firstValue = "";
    calculator.dataset.nextValue = "";
    calculator.dataset.operator = "";
    calculator.dataset.lastAction = "";
}();