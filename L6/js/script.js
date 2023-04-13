// Globala konstanter och variabler
const roomPrice = [600, 800, 950];		// Pris för rumstyperna
const facilityPrice = [40, 80, 100];	// Pris för tilläggen
var formElem;		// Referens till elementet med hela formuläret
var roomElems;
var city;
// --------------------------------------------------
// Initiera globala variabler och händelsehanterare. Lägg till info om pris.
function init() {
	formElem = document.getElementById("booking");
	roomElems = document.getElementById("room").getElementsByTagName("input")
	city = document.getElementById("city")

	console.log("lenght:", formElem.roomType.length);
	for (let i = 0; i < formElem.roomType.length; i++) {
		formElem.roomType[i].addEventListener("click", checkIfFamilyRoom)
		formElem.roomType[i].addEventListener("click", calculateCost)
		formElem.roomType[i].nextSibling.textContent += `(${roomPrice[i]} kr)`
	}

	for (let i = 0; i < formElem.facility.length; i++) {
		formElem.facility[i].addEventListener("click", calculateCost)
		formElem.facility[i].nextSibling.textContent += `(${facilityPrice[i]} kr)`
	}


	// Händelsehanterare för textfält som ska kontrolleras
	formElem.nrOfNights.addEventListener("change", calculateCost)
	document.getElementById("city").addEventListener("blur", checkCity)
	document.getElementById("zipcode").addEventListener("blur", checkField)
	document.getElementById("telephone").addEventListener("blur", checkField)

	// Händelsehanterare för kampanjkod
	formElem.campaigncode.addEventListener("focus", checkCampaign)
	formElem.campaigncode.addEventListener("keyup", checkCampaign)
	formElem.campaigncode.addEventListener("blur", endCheckCampaign)

	calculateCost()
	checkIfFamilyRoom()
} // Slut init
window.addEventListener("load", init);
// --------------------------------------------------

// Aktiverar eller inaktiverar fältet beroende på om rum typen är familherum
function checkIfFamilyRoom() {
	console.log(this);
	if (formElem.roomType[2].checked) {
		formElem.persons.disabled = false;
		formElem.persons.parentNode.style.color = "#000";
		formElem.facility[2].disabled = true;
		formElem.facility[2].parentNode.style.color = "#999";
		formElem.facility[2].checked = false
	} else {
		formElem.persons.disabled = true;
		formElem.persons.parentNode.style.color = "#999";
		formElem.facility[2].disabled = false;
		formElem.facility[2].parentNode.style.color = "#000";
	}
}

// Kalkulera kostnaden av bookningne med rum typen , tillägg och antal dagar
function calculateCost() {
	let price = 0
	let nrOfNights = formElem.nrOfNights.value
	console.log(nrOfNights);

	for (let i = 0; i < formElem.roomType.length; i++) {
		if (formElem.roomType[i].checked) {
			price = roomPrice[i]
			break
		}
	}

	for (let i = 0; i < formElem.facility.length; i++) {
		console.log("Price after facilities:", price)
		if (formElem.facility[i].checked) {
			price += facilityPrice[i]
		}
	}

	console.log("Price:", price, "math:", nrOfNights * price);
	document.getElementById("totalCost").innerHTML = `${nrOfNights * price}`

}

// Förvändala inmatningen av stad till sotra bokstäver
function checkCity() {
	let city = this.value
	city = city.toUpperCase()
	this.value = city
}

function checkField(e, field) {
	if (!field) field = this;
	const fieldNames = ["zipcode", "telephone"];
	const re = [ // Array med reguljära uttryck för fälten
		/^\d{3} ?\d{2}$/,            // Postnummer
		/^0\d{1,3}[-/ ]?\d{5,8}$/    // Telefonnummer
	];
	const errMsg = [ // Array med felmeddelanden
		"Postnumret måste bestå av fem siffror.",
		"Telnr måste börja med en 0:a och följas av 6-11 siffror."
	];
	let ix = fieldNames.indexOf(field.name); // Index till re och errMsg
	let errMsgElem = field.nextElementSibling; // Element för felmeddelande
	errMsgElem.innerHTML = "";
	if (!re[ix].test(field.value)) {
		errMsgElem.innerHTML = errMsg[ix];
		return false; // Fel i fältet
	}
	else return true; // Fältet är OK
} // Slut checkField

// Kontrollera om inmatningningen matchar mönstret "ABC-12-D3" 
// Ändra färg på kampanj fältets bakgund 
function checkCampaign() {
	// "ABC-12-D3"
	console.log("test");
	const re = /^[A-Za-z]{3}-\d{2}-[A-Za-z]\d$/; // Result example: ABC-12-D3

	if (re.test(this.value)) {
		this.style.backgroundColor = "#6F9";
	} else {
		this.style.backgroundColor = "#F99";
	}

}

// Ta bort bakgrunds färgen på campingcode fältet 
function endCheckCampaign() {
	this.style.backgroundColor = ""
}


