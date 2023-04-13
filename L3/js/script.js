// Globala konstanter och variabler
const wordList = ["BLOMMA", "LASTBIL", "SOPTUNNA", "KÖKSBORD", "RADIOAPPARAT", "VINTER", "SOMMAR", "DATORMUS", "LEJON", "ELEFANTÖRA", "JULTOMTE", "SKOGSHYDDA", "BILNUMMER", "BLYERTSPENNA", "SUDDGUMMI", "KLÄDSKÅP", "VEDSPIS", "LJUSSTAKE", "SKRIVBORD", "ELDGAFFEL", "STEKPANNA", "KASTRULL", "KAFFEBRYGGARE", "TALLRIK", "SOFFBORD", "TRASMATTA", "FLYGPLAN", "FLYGPLATS", "TANGENTBORD"]; // Lista (array) med ord som ska väljas slumpmässigt
var selectedWord, // Det valda slumpmässiga ordet som ska gissas på
    letterBoxes, // Referens till span-taggarsom utgör rutor för bokstäverna i ordet
    hangmanImg, // Referens till img-elmentet
    hangmanNr, // Nummer för aktuell bild
    msgElem, // Div-element för meddelanden
    startGameBtn, // Referera till start knappen
    letterButtons, // Referera till bokstavs knapparna
    startTime       // Spara tiden när spelet startar

// Körs när start knappen blir tryckt. Starta spelet genom att köra funkonerna som väljer ett ord och skriver ut rutor.
// Gör så att det är möjligt att trycka på knapparna.
function startGame() {
    randomWorld()
    showLetterBox()

    hangmanImg.src = "img/h0.png"
    hangmanNr = 0

    startGameBtn.disabled = true
    for (let i = 0; i < letterButtons.length; i++) {
        letterButtons[i].disabled = false
    }
    msgElem.innerHTML = ""

    let now = new Date();
    startTime = now.getTime()

} //Slut startGame

// Väljer slumpmäsigt ordet som ska gissas på.
function randomWorld() {
    let oldWord = selectedWord
    while (selectedWord == oldWord) {
        let ix = Math.floor(Math.random() * wordList.length)
        selectedWord = wordList[ix]
    }
} // slut randomWorld

// Skriv ut antal rutor som det finns bokstäver i ordet. Varje ruta representera en gömd bokstav
function showLetterBox() {
    let newCode = ""
    for (let i = 0; i < selectedWord.length; i++) {
        console.log(`${selectedWord[i]}`);
        newCode += `<span>&nbsp</span>`
    }
    document.getElementById("letterBoxes").innerHTML = newCode
    letterBoxes = document.getElementById("letterBoxes").getElementsByTagName("span")
} // Slut showLetter

// Körs när en bokstav blir tryckt. Knappen blir avaktiverad och kontrollera att 
// bokstaven finns i currentWord. KOntrollera också om man har vunnit eller förlorat.
function guessLetter() {
    this.disabled = true
    let letter = this.value
    let letterFound = false
    let correctLettersCount = 0
    for (let i = 0; i < selectedWord.length; i++) {
        let wordLetter = selectedWord.charAt(i)

        if (letter == wordLetter) {
            console.log(`index: ${i} Letter: ${wordLetter}`);
            letterBoxes[i].innerHTML = wordLetter
            letterFound = true
        }
        if (letterBoxes[i].innerHTML != "&nbsp;") {
            correctLettersCount++
        }
    }

    if (!(letterFound)) {
        hangmanImg.src = `img/h${++hangmanNr}.png`
        if (hangmanNr == 6) {
            console.log("TEST1", hangmanNr);

            endGame(true)
        }
    }
    console.log("TEST2", correctLettersCount, selectedWord.length);
    if (correctLettersCount == selectedWord.length) {
        endGame(false)
    }
} // Slut guessLetter

// När spelet slutar skrivs ett medelande ut so mberättar man har vunnit eller 
// förlorat. Bokstavs knapparna stängs av tiden det tog att spela skrivs ut.
function endGame(manHanged) {
    let runTime = (new Date().getTime() - startTime) / 1000

    console.log(manHanged);
    if (manHanged) {
        msgElem.innerHTML = `Gubben hängdes. Rätt ord är "${selectedWord}".`
    } else {
        msgElem.innerHTML = `Grattis, du vann!!`
    }
    startGameBtn.disable = false
    for (let i = 0; i < letterButtons.length; i++) {
        letterButtons[i].disabled = true
    }
    msgElem.innerHTML += `<br>Det tog" ${runTime} sekunder".`
} // Slut endGame


// --------------------------------------------------
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {
    startGameBtn = document.getElementById("startGameBtn").onclick = startGame
    letterButtons = document.getElementById("letterButtons").getElementsByTagName("button")
    for (let i = 0; i < letterButtons.length; i++) {
        letterButtons[i].onclick = guessLetter
    }
    hangmanImg = document.getElementById("hangman")
    msgElem = document.getElementById("message")

    startGameBtn.disabled = false
    for (let i = 0; i < letterButtons.length; i++) {
        letterButtons[i].disabled = true
    }

} // Slut init
window.onload = init; // Se till att init aktiveras då sidan är inladdad
// --------------------------------------------------


