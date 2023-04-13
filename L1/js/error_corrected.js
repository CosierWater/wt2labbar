// Globala variabler
var inp1Elem, inp2Elem;	// Referenser till textfältet för input
var resElem;			// Referens till div-elementet för resultat

// Initiering av globala variabler och händelsehanterare
function init() {
	inp1Elem = document.getElementById("input1");
	inp2Elem = document.getElementById("input2");
	resElem = document.getElementById("result");
	document.getElementById("runBtn").onclick = areaCalculations;
} // End init
window.onload = init; // Se till att init aktiveras då sidan är inladdad

// --------------------------------------------------

// Kod för beräkningar av area
function areaCalculations() {
	// Deklaration av variabler
	var length;		// Längd i meter
	var width;		// bredd i meter
	var area;		// Yta i kvadratmeter
	
	length = Number(inp1Elem.value);
	width = Number(inp2Elem.value);

	area = length  * width;
	resElem.innerHTML = "<p>Rektangelns area: " + area + "</p>";
	
	area = length * width / 2;
	resElem.innerHTML += "<p>Triangelns area: " + area + "</p>";
	
	area = 3.14 * length * width / 4;
	resElem.innerHTML += "<p>Ellipsens area: " + area + "</p>";
	
} // End areaCalculations
