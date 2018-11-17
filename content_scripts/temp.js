var res, btns, btn0, btn1, btnClr, btnEql, btnSum, btnSub, btnMul, btnDiv;

function elementCreator(eleType, eleID, node, content="") {
    let eleName = document.createElement(eleType);
    eleName.id = eleID;
    if (content !== "") {
        eleName.className = "allBtns";
        eleName.innerHTML = content;
    }

    if (node === "body") {
        document.body.appendChild(eleName);
    }
    else {
        document.getElementById(node).appendChild(eleName);
    }

    return eleName;
}

function calculator(e) {
    /* Older IE browsers have a srcElement property,
    but other browsers have a 'target' property;
    Set btn to whichever exists. */
    var btn = e.target || e.srcElement;

    switch(btn.id) {
        case "btn0":
            res.innerHTML += "0";
            break;
        case "btn1":
            res.innerHTML += "1";
            break;
        case "btnClr":
            res.innerHTML = "";
            break;
        case "btnEql":
            if (res.innerHTML !== "") {
                let operator = res.innerHTML.search(/[-+*/]/i);
                if (operator !== -1) {
                    operator = res.innerHTML[operator];

                    let operands = res.innerHTML.split(operator);
                    // The way to map array with function of multiple params
                    // e is the element of the array
                    operands = operands.map(e => parseInt(e, 2));

                    let result = eval(operands[0] + operator + operands[1]);
                    res.innerHTML = Math.floor(result).toString(2);
                }
            }
            break;
        case "btnSum":
            res.innerHTML += "+";
            break;
        case "btnSub":
            res.innerHTML += "-";
            break;
        case "btnMul":
            res.innerHTML += "*";
            break;
        case "btnDiv":
            res.innerHTML += "/";
            break;
        default:
            break;
    }
}

// In body
res = elementCreator('div', "res", "body");
btns = elementCreator('div', "btns", "body");

// In btns container
let calcContainer = {
    btn0: 0,
    btn1: 1,
    btnClr: "C",
    btnEql: "=",
    btnSum: "+",
    btnSub: "-",
    btnMul: "*",
    btnDiv: "/"
};

// Create the buttons and set up the on click event handler
for (let ele in calcContainer) {
    elementCreator('button', `${ele}`, "btns", calcContainer[ele]).onclick = calculator;
}


