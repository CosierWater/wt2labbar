// Globala konstanter och variabler
var boardElem;			// Referens till div-element för "spelplanen"
const allCarImgs = [
	[], // Inga bilar för index 0
	["ferrari_up.png", "ferrari_right.png", "ferrari_down.png", "ferrari_left.png"],
	["jeep_up.png", "jeep_right.png", "jeep_down.png", "jeep_left.png"],
	["vw_up.png", "vw_right.png", "vw_down.png", "vw_left.png"]
];
var carImgs;			// Array med vald bil (någon av ovanstående arrayer)
// Array med filnamn för bilderna med bilen
var carDir = 1;			// Riktning för bilen, index till carImgs
var carElem;			// Referens till img-element för bilen
const xStep = 10;		// Antal pixlar som bilen ska förflytta sig i x-led
const yStep = 10;		// eller y-led i varje steg
const timerStep = 20;	// Tid i ms mellan varje steg i förflyttningen
var timerRef = null;	// Referens till timern för bilens förflyttning
var startBtn;			// Referens till startknappen
var stopBtn;			// Referens till stoppknappen
var carMenu;			// Referens till menyn för att välja bil
/* ===== Tillägg i labben ===== */

var pigElem 			// Referens till vildsvinet 
var pigTimerRef = null 	// Referens till timern för vildsvinet förflyttning
const pigDuration = 3000 // Tid i ms mellan varje vildsvinet förflyttas
const maxPigNr = 10
var pigNr				// Antal vildsvinet som har skapats 
var hitCounter			// Antal påkörda vildsvin
var pigNrElem			// Referens till elementet för räkning av vildsvin
var hitCounterElem		// referens till element för påkörda vildsvin
var catchedPig			// Kontrollera om grisen är påkörd


// --------------------------------------------------
// Bilderna laddas in i förväg, så att alla bilder finns i webbläsarens cache, när de behövs
for (let i = 0; i < allCarImgs.length; i++) {
	for (let j = 0; j < allCarImgs[i].length; j++) {
		let img = new Image();
		img.src = "img/" + allCarImgs[i][j];
	}
}
{ // Förladda "smack"-bilden
	let img = new Image();
	img.src = "img/smack.png";
}
// --------------------------------------------------
// Initiera globala variabler och händelsehanterare
function init() {
	// Referenser till element i gränssnittet
	boardElem = document.getElementById("board");
	carElem = document.getElementById("car");
	startBtn = document.getElementById("startBtn");
	stopBtn = document.getElementById("stopBtn");
	carMenu = document.getElementById("carMenu");
	pigElem = document.getElementById("pig")
	pigNrElem = document.getElementById("pigNr")
	hitCounterElem = document.getElementById("hitCounter")
	// Lägg på händelsehanterare
	document.addEventListener("keydown", checkKey);
	// Känna av om användaren trycker på tangenter för att styra bilen
	startBtn.addEventListener("click", startGame);
	stopBtn.addEventListener("click", stopGame);
	carMenu.addEventListener("change", chooseCar);
	// Aktivera/inaktivera knappar
	startBtn.disabled = false;
	stopBtn.disabled = true;
	carMenu.disabled = false;
	// Första bil
	carImgs = allCarImgs[1];
	carElem.src = "img/" + carImgs[carDir];

	/* === Tillägg i labben === */

} // Slut init
window.addEventListener("load", init);
// --------------------------------------------------
// Kontrollera tangenter och styr bilen
function checkKey(e) { // Anropas vid keydown
	let k = e.key;
	switch (k) {
		case "ArrowLeft":
		case "z":
			e.preventDefault();
			carDir--; // Bilens riktning 90 grader åt vänster
			if (carDir < 0) carDir = 3;
			carElem.src = "img/" + carImgs[carDir];
			break;
		case "ArrowRight":
		case "-":
			e.preventDefault();
			carDir++; // Bilens riktning 90 grader åt höger
			if (carDir > 3) carDir = 0;
			carElem.src = "img/" + carImgs[carDir];
			break;
	}
} // Slut checkKey
// --------------------------------------------------
// Val av bil genom menyn. Array med valda bildfiler läggs in i carImgs
function chooseCar() {
	carImgs = allCarImgs[this.selectedIndex];
	carElem.src = "img/" + carImgs[carDir];
	this.selectedIndex = 0;
} // Slut chooseCar
// --------------------------------------------------
// Initiera spelet och starta bilens rörelse
function startGame() {
	catchedPig = true
	startBtn.disabled = true;
	stopBtn.disabled = false;
	carMenu.disabled = true;
	document.activeElement.blur(); // Knapparna sätts ur focus, så att webbsidan kommer i fokus igen
	// Detta behövs för att man ska kunna känna av händelsen keydown i Firefox.
	carElem.style.left = "0px";
	carElem.style.top = "0px";
	carDir = 1;
	carElem.src = "img/" + carImgs[carDir];
	moveCar();

	/* === Tillägg i labben === */

	pigNr = 0
	hitCounter = 0
	pigNrElem.innerHTML = pigNr
	hitCounterElem.innerHTML = hitCounter

	pigTimerRef = setTimeout(newPig, pigDuration);


} // Slut startGame
// --------------------------------------------------
// Stoppa spelet
function stopGame() {
	if (timerRef != null) clearTimeout(timerRef);
	if (pigTimerRef != null) clearTimeout(pigTimerRef);
	pigElem.style.visibility = "hidden"
	console.log(pigTimerRef, pigElem.style.visibility);
	startBtn.disabled = false;
	stopBtn.disabled = true;
	carMenu.disabled = false;
	/* === Tillägg i labben === */

} // Slut stopGame
// --------------------------------------------------
// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
	let xLimit = boardElem.offsetWidth - carElem.offsetWidth;
	let yLimit = boardElem.offsetHeight - carElem.offsetHeight;
	let x = parseInt(carElem.style.left);	// x-koordinat (left) för bilen
	let y = parseInt(carElem.style.top);	// y-koordinat (top) för bilen
	switch (carDir) {
		case 0: // Uppåt
			y -= yStep;
			if (y < 0) y = 0;
			break;
		case 1: // Höger
			x += xStep;
			if (x > xLimit) x = xLimit;
			break;
		case 2: // Nedåt
			y += yStep;
			if (y > yLimit) y = yLimit;
			break;
		case 3: // Vänster
			x -= xStep;
			if (x < 0) x = 0;
			break;
	}
	carElem.style.left = x + "px";
	carElem.style.top = y + "px";
	timerRef = setTimeout(moveCar, timerStep);

	/* === Tillägg i labben === */

	checkHit()

} // Slut moveCar
// --------------------------------------------------

/* ===== Tillägg av nya funktioner i labben ===== */

// Skapa ett nytt vildsvin
function newPig() {
	
	// Bestämmer positionen på vildsvinet
	let xLimit = boardElem.offsetWidth - pigElem.offsetWidth - 20
	let yLimit = boardElem.offsetHeight - pigElem.offsetHeight - 20
	console.log(pigElem.offsetWidth, carElem.offsetWidth);
	let x = Math.floor(xLimit * Math.random()) + 10
	let y = Math.floor(yLimit * Math.random()) + 10
	pigElem.style.left = `${x}px`
	pigElem.style.top = `${y}px`
	pigElem.src = "img/pig.png"
	pigElem.style.visibility = "visible"

	// KOntrollera att fler än maxPigNr skapas
	if (pigNr < maxPigNr) {
		catchedPig = false
		pigTimerRef = setTimeout(newPig, pigDuration);
		pigNrElem.innerHTML = ++pigNr
	} else {
		stopGame()
	}

}

// Kontrollera om vildsvinet blivit påkört
function checkHit() {
	if (catchedPig) {
		return;
	}

	let cSize = carElem.offsetWidth
	let pSize = pigElem.offsetWidth
	let cL = parseInt(carElem.style.left)
	let cT = parseInt(carElem.style.top)
	let pL = parseInt(pigElem.style.left)
	let pT = parseInt(pigElem.style.top)
	
	if (cL + 10 < pL + pSize && cL + cSize - 10 > pL && cT + 10 < pT + pSize && cT + cSize - 10 > pT) {
		catchedPig = true
		console.log("Hit Pig")

		clearTimeout(pigTimerRef)
		pigElem.src = "img/smack.png"
		pigTimerRef = setTimeout(newPig, pigDuration);

		hitCounterElem.innerHTML = ++hitCounter
		console.log(catchedPig);

	}
}


