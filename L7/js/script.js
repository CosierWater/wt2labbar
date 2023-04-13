var allNrs = []                 // An array containing all numbers up to 40.
var tempNrs = []                // A temporary array used for generating new tiles.
var ghostTiles = []             // An array containing the ghost tiles.
var startBtnElem                // The start button element.
var newTilesBtnElem             // The new tiles button element.
var boardTileElems              // The tile elements on the game board.
var boardElem                   // The game board element.
var newTilesElems               // The tile elements for generating new tiles.
var newTilesElem                // The element containing the new tiles.
var ghostElem                   // The ghost element.
var dragElem                    // The element being dragged.
var msg                         // The message element.
var userInfo                    // An array containing user information. [totPoints, countGames]
var moveCounter                 // The current move count.
var ghostTimerRef = null        // A reference to the ghost timer.
const ghostTimer = 5000         // The time interval for the ghost timer.


// Initialize variables and event listeners
function init() {

    // Populates the "allNrs" array with numbers from 1 to 40
    for (let i = 1; i <= 40; i++) {
        allNrs.push(i)
    }

    // Gets references to various elements on the page and assigns them to global variables
    startBtnElem = document.getElementById("newGameBtn")
    newTilesBtnElem = document.getElementById("newTilesBtn")
    boardElem = document.getElementById("board")
    boardTileElems = document.getElementById("board").getElementsByClassName("tile")
    newTilesElem = document.getElementById("newTiles")
    newTilesElems = document.getElementById("newTiles").getElementsByClassName("tile")
    ghostElem = document.getElementById("ghost")
    msg = document.getElementById("message")

    // Adds event listeners
    startBtnElem.addEventListener("click", startGame)
    newTilesBtnElem.addEventListener("click", generateNewNrs)

    for (let i = 0; i < newTilesElems.length; i++) {
        newTilesElems[i].addEventListener("dragstart", dragstartNr)
        newTilesElems[i].addEventListener("dragend", dragendNr)
    }
    for (let i = 0; i < boardTileElems.length; i++) {
        boardTileElems[i].addEventListener("dragstart", dragstartNr)
        boardTileElems[i].addEventListener("dragend", dragstartNr)
    }

    // Retrieves user info from localStorage, if available, and updates the corresponding elements on the page
    userInfo = JSON.parse(localStorage.getItem('vk222gruserInfo'));
    if (userInfo === null) {
        localStorage.setItem('vk222gruserInfo', JSON.stringify([0, 0]));
        userInfo = JSON.parse(localStorage.getItem('vk222gruserInfo'));
    }

    console.log(userInfo);
    document.getElementById("totPoints").innerHTML = `${userInfo[0]}`
    document.getElementById("countGames").innerHTML = `${userInfo[1]}`

    newTilesBtnElem.disabled = true
} // End of init
window.addEventListener("load", init); // Se till att init aktiveras då sidan är inladdad


/**
 * Starts a new game.
 */
function startGame() {
    newTilesBtnElem.disabled = false
    startBtnElem.disabled = true

    moveCounter = 4
    document.getElementById("moveCount").innerHTML = moveCounter

    msg.innerHTML = ""
    for (let i = 0; i < boardTileElems.length; i++) {
        boardTileElems[i].innerHTML = ""
        boardTileElems[i].className = boardTileElems[i].className.replace("filled", "empty");
    }

    const marks = document.getElementsByClassName("mark")
    for (let i = 0; i < marks.length; i++) {
        marks[i].classList.remove("cross", "check")
    }

    for (let i = 0; i < newTilesElems.length; i++) {
        newTilesElems[i].className = newTilesElems[i].className.replace("filled", "empty");
    }

    tempNrs = allNrs.slice(0)

    // Generate a random time between 30-60 seconds in milliseconds
    const randomTime = Math.floor(Math.random() * 30000) + 30000;

    ghostTimerRef = setTimeout(ghost, randomTime)

} // End of startGame

/**
 * Generates new tiles.
 */
function generateNewNrs() {
    newTilesBtnElem.disabled = true
    for (let i = 0; i < newTilesElems.length; i++) {
        const r = Math.floor(Math.random() * tempNrs.length);
        newTilesElems[i].innerHTML = tempNrs[r]
        newTilesElems[i].className = newTilesElems[i].className.replace("empty", "filled");
        newTilesElems[i].draggable = true
        tempNrs.splice(r, 1)
    }


} // End of generateNewNrs

/**
 * Handles the start of a drag event on a number tile.
 */
function dragstartNr() {
    dragElem = this
    for (let i = 0; i < boardTileElems.length; i++) {
        boardTileElems[i].addEventListener("dragover", nrOverTile)
        boardTileElems[i].addEventListener("drop", nrOverTile)
        boardTileElems[i].addEventListener("dragleave", nrLeaveTile)
    }
} // End of dragstartNr

/**
 * Handles the end of a drag event on a number tile.
 */
function dragendNr() {
    console.log("Drag End");
    for (let i = 0; i < boardTileElems.length; i++) {
        boardTileElems[i].removeEventListener("dragover", nrOverTile)
        boardTileElems[i].removeEventListener("drop", nrOverTile)
        boardTileElems[i].removeEventListener("dragleave", nrLeaveTile)
    }


} // End of dragendNr

/**
 * Handles a drag event over a game board tile.
 * @param {DragEvent} e - The drag event.
 */
function nrOverTile(e) {
    e.preventDefault()
    if (this.classList.contains("empty")) {
        this.style.backgroundColor = "green"
    }
    if (e.type == "drop" && dragElem.parentNode.id == "newTiles") {
        const dropElem = this
        if (this.innerHTML == "") {
            dropElem.innerHTML = dragElem.innerHTML
            dropElem.className = dropElem.className.replace("empty", "filled");
            dragElem.innerHTML = ""
            dragElem.className = dragElem.className.replace("filled", "empty");
            dropElem.style.backgroundColor = ""
            dropElem.draggable = true
        }

        // Check if all new tiles have been used before allowing the user to generate new ones.
        let counter = 0
        for (let i = 0; i < newTilesElems.length; i++) {
            if (newTilesElems[i].innerHTML == "") {
                counter++
            }
        }
        if (counter == 4) newTilesBtnElem.disabled = false;

        // Check if game is over
        let boardCounter = 0
        for (let i = 0; i < boardTileElems.length; i++) {
            if (boardTileElems[i].innerHTML != "") boardCounter++;
        }
        console.log(boardCounter);
        if (boardCounter == 16) endGame();
    } else if (e.type == "drop" && dragElem.parentNode.id == "board" && moveCounter != 0) {
        const dropElem = this

        const classes = Array.from(dragElem.classList)
        const classNumber1 = parseInt(classes[1][1])
        const classNumber2 = parseInt(classes[2][1])
        console.log(classes, classNumber1, classNumber2);
        console.log(Array.from(dropElem.classList));
        if (dropElem.classList.contains(`s${classNumber1 + 1}`) && dropElem.classList.contains(`s${classNumber2}`) || dropElem.classList.contains(`s${classNumber1 - 1}`) && dropElem.classList.contains(`s${classNumber2}`) || dropElem.classList.contains(`s${classNumber1}`) && dropElem.classList.contains(`s${classNumber2 + 1}`) || dropElem.classList.contains(`s${classNumber1}`) && dropElem.classList.contains(`s${classNumber2 - 1}`)) {

            dropElem.innerHTML = dragElem.innerHTML
            dropElem.className = dropElem.className.replace("empty", "filled");
            dragElem.innerHTML = ""
            dragElem.className = dragElem.className.replace("filled", "empty");
            dropElem.style.backgroundColor = ""
            dropElem.draggable = true
            dragElem.draggable = false

            document.getElementById("moveCount").innerHTML = --moveCounter

        }
    }
    if (e.type == "drop") {
        const dropElem = this
        dropElem.style.backgroundColor = ""
    }
} // End of nrOverTile

/**
 * Handles a drag event leaving a game board tile.
 */
function nrLeaveTile() {
    this.style.backgroundColor = ""
} // End of nrLeaveTile

/**
 * Ends the current game.
 */
function endGame() {
    clearInterval(ghostTimerRef);
    console.log("END GAME");
    newTilesBtnElem.disabled = true
    startBtnElem.disabled = false;

    // Count score.
    let score = 0
    for (let i = 1; i <= 8; i++) {
        const rowColumnElems = document.getElementsByClassName(`s${i}`)
        const CheckElem = document.getElementById(`s${i}mark`)
        for (let k = 0; k < rowColumnElems.length - 1; k++) {
            if (parseInt(rowColumnElems[k].innerHTML) > parseInt(rowColumnElems[k + 1].innerHTML)) {
                CheckElem.classList.add("cross")
                break;
            }
        }
        if (!(CheckElem.classList.contains("cross"))) {
            CheckElem.classList.add("check")
            score++
        }
    }
    msg.innerHTML = `Du fick ${score} utav 8 poäng`

    userInfo[0] += parseInt(score)
    userInfo[1]++

    // Update Total points and Total number of games in local storage.
    localStorage.setItem('vk222gruserInfo', JSON.stringify(userInfo));
    document.getElementById("totPoints").innerHTML = `${userInfo[0]}`
    document.getElementById("countGames").innerHTML = `${userInfo[1]}`
} // End of endGame


/**
 * Generates ghost tiles and displays them on the game board.
 */
function ghost() {
    console.log("GHOST");
    clearInterval(ghostTimerRef);
    ghostElem.style.visibility = "visible"

    let remainingTiles = [];
    ghostTiles = []
    for (let i = 0; i < boardTileElems.length; i++) {
        if (boardTileElems[i].classList.contains("filled")) {
            remainingTiles.push(boardTileElems[i])
        }
    }
    if (remainingTiles.length > 4) {
        for (let i = 0; i < 4; i++) {
            let r = Math.floor(Math.random() * remainingTiles.length);
            let tile = remainingTiles[r];
            ghostTiles.push(tile);
            remainingTiles.splice(r, 1)
        }
    }
    else {
        remainingTiles.forEach(function (tile) {
            console.log(tile);
            ghostTiles.push(tile);
        });
        remainingTiles = remainingTiles.filter(function (tile) {
            return !ghostTiles.includes(tile);
        });

        console.log("ghost:", ghostTiles, "remain:", remainingTiles);
    }
    ghostTiles.forEach(function (ghostTile) {
        ghostTile.classList.add("ghostTile")
        ghostTile.classList.remove("filled")
        console.log("GhostTile:", ghostTile);
    })

    console.log("ghost:", ghostTiles, "rem:", remainingTiles);
    setTimeout(removeGhostTiles, 2000);
    ghostTimerRef = setTimeout(ghost, Math.floor(Math.random() * 30000) + 30000)
} // End of ghost

/**
 * Removes ghost tiles and returns their numbers to the number pool.
 */
function removeGhostTiles() {
    ghostTiles.forEach(function (tile) {
        let tileNumber = parseInt(tile.innerHTML);
        tile.classList.add("empty")
        tile.classList.remove("ghostTile")
        tempNrs.push(tileNumber);
        tile.innerHTML = '';
    })
    ghostElem.style.visibility = "hidden"
} // end of removeGhostTiles
