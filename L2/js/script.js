// Globala variabler
var inp1Elem, // Elementet som innerhåller kontrollera vilken frukt som ska väljas
    inp2Elem, // Elementet som innerhåller hur många gånger frukten ska skrivas ut
    msgElem, // Hantering av Error medelanden presenteras för användaren
    selFriutNr // Spara den valda Frukten 

// --------------------------------------------------
// Initiering av globala variabler och händelsehanterare
function init() {
    inp1Elem = document.getElementById("input1")
    inp2Elem = document.getElementById("input2")
    msgElem = document.getElementById("message")
    selFriutNr = 0
    btn1 = document.getElementById("btn1").onclick = showFruit
    btn2 = document.getElementById("btn2").onclick = addFruits


} // Slut init
window.onload = init; // Se till att init aktiveras då sidan är inladdad
// --------------------------------------------------

//Väljer en bild som sedan visas på sidan
function showFruit() {
    
    let nr = getInput(inp1Elem, 5) 
    //Kontrollera om input är en siffra
    if (nr == -1) return
    //Ändra till vald bild
    fruitImg = document.getElementById("fruitImg").src = getUrl(nr)
    //Spara frukt nummret i en global varable
    selFriutNr = nr
}

// Väljer frukt bild
function getUrl(nr) {
    let url
    // Välj bild
    switch (nr) {
        case 1: url = "img/apple.png"; break;
        case 2: url = "img/banana.png"; break;
        case 3: url = "img/orange.png"; break;
        case 4: url = "img/pear.png"; break;
        case 5: url = "img/pineapple.png"; break;
        default: url = "img/nofruit.png"; break;
    }
    return url
} //end getUrl

//Kontrollera om om elem är en siffra och om det befinner sig i rätt tal längd
function getInput(elem, high) {
    msgElem.innerHTML = ""
    let nr = Number(elem.value)

    if (isNaN(nr)) {
        msgElem.innerHTML = "Du måste skriva ett tal med siffror"
        return -1
    }
    if (nr < 1 || nr > high) {
        msgElem.innerHTML = "Du måste skriva ett tal mellan 1 och " + high
        return -1
    }
    nr = parseInt(nr)
    elem.value = nr
    return nr
} // end getInput

//Lägger till frukt i 'Valda frukter' sektionen så månmga gånger som står i inp2Elem. 
function addFruits() {
    let amount = getInput(inp2Elem, 9)
    if (amount == -1) return

    let imglist = ""
    var fruitUrl = getUrl(selFriutNr)
    for (let i = 0; i < amount; i++) {
        imglist += `<img src='${fruitUrl}' alt='frukt'></img>`
    }
    document.getElementById("selectedFruits").innerHTML += imglist
} // end addFruits




