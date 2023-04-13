var inp1Elm, inp2Elm
var resElm

function init() {
    inp1Elm = document.getElementById("input1")
    inp2Elm = document.getElementById("input2")
    resElm = document.getElementById("result")
    document.getElementById("runBtn").onclick = areaClaculation
}
window.onload = init

function areaClaculation(params) {
    let length
    let width
    let area

    length = Number(inp1Elm.value)
    width = Number(inp2Elm.value)

    //Area för en rektangle
    area = length * width

    resElm.innerHTML = `<p>Rektangelns area är ${area} m<sup>2</sup></p>`

    //Area för ellips
    area = 3.14 * length *width / 4
    resElm.innerHTML += `<p>Ellipsen area är ${area} m<sup>2</sup></p>`

    //rektangelns area då längden ökas med 5
    area = (length + 5) * width
    resElm.innerHTML += `<p>Då länden ökas med 5m blir rektangelns area ${area} m<sup>2</sup></p>`

    area = (length * 1.5) * (width + 3)
    resElm.innerHTML += `<p>Då länden ökas med 50% och bredden med 3 meter blir rektangelns area ${area} m<sup>2</sup></p>` 
    
    area = (length * 3.28) * (width * 3.28) / 2
    console.log(area);
    resElm.innerHTML += `<p>Tringelns area blir ${area} kvadratfot</p>` 


}