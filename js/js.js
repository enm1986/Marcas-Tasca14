var xhttp = new XMLHttpRequest();
var url = "https://raw.githack.com/enm1986/Marcas-Tasca14/master/xml/preguntas.xml";
var url2 = "xml/preguntas.xml"
var xmlDoc = null;
var duracion = 60 * 1; // 10 minutos
var time;
var timer;
//respuestas correctas
var p1 = [];
var p2 = [];
var p3 = [];
var p4 = [];
var p5 = [];
var p6 = [];
var p7 = [];
var p8 = [];
var p9 = [];
var p10 = [];
var nota = 0.0;  //nota de la prueba

//**************************************************************************************************** 

//Empezar examen
function confirmar() {
    var r = confirm("El examen tiene un tiempo límite de 10 min.\n ¿Quieres empezar el examen?");
    if (r) {
        document.datos.action = "exam.html";
    }
}

//Después de cargar la página (onload) se definen los eventos sobre los elementos entre otras acciones.
window.onload = function () {

    //LEER XML de xml/preguntas.xml
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            gestionarXml(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();

    //iniciar temporizador

    time = duracion;
    timer = setInterval(actualizarTemp, 1000);

    //CORREGIR al apretar el botón
    formElement = document.getElementById('formulario');
    formElement.onsubmit = function () {
        inicializar();
        if (comprobar()) {
            corregirTodo();
            presentarNota();
            deshabilitarForm();
            clearInterval(timer);
            window.scrollTo(0, 0);
        }
        return false;
    }
}

//****************************************************************************************************
// Recuperamos las respuestas del fichero XML xml/preguntas.xml
// xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml) {
    var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc

    var resp1 = xmlDoc.getElementById("p01").getElementsByTagName('answer').length;
    for (i = 0; i < resp1; i++) {
        p1[i] = xmlDoc.getElementById("p01").getElementsByTagName("answer")[i].innerHTML;
    }

    var resp2 = xmlDoc.getElementById("p02").getElementsByTagName('answer').length;
    for (i = 0; i < resp2; i++) {
        p2[i] = xmlDoc.getElementById("p02").getElementsByTagName("answer")[i].innerHTML;
    }

    var resp3 = xmlDoc.getElementById("p03").getElementsByTagName('answer').length;
    for (i = 0; i < resp3; i++) {
        p3[i] = xmlDoc.getElementById("p03").getElementsByTagName("answer")[i].innerHTML;
    }

    var resp4 = xmlDoc.getElementById("p04").getElementsByTagName('answer').length;
    for (i = 0; i < resp4; i++) {
        p4[i] = xmlDoc.getElementById("p04").getElementsByTagName("answer")[i].innerHTML;
    }

    p5[0] = xmlDoc.getElementById("p05").getElementsByTagName("answer")[0].innerHTML;

    p6[0] = xmlDoc.getElementById("p06").getElementsByTagName("answer")[0].innerHTML;

    p7[0] = xmlDoc.getElementById("p07").getElementsByTagName("answer")[0].innerHTML;

    p8[0] = xmlDoc.getElementById("p08").getElementsByTagName("answer")[0].innerHTML;

    p9[0] = xmlDoc.getElementById("p09").getElementsByTagName("answer")[0].innerHTML;

    p10[0] = xmlDoc.getElementById("p10").getElementsByTagName("answer")[0].innerHTML;

}

//****************************************************************************************************
function inicializar() {
    document.getElementById('div_nota').innerHTML = "";
    var a = document.getElementsByClassName('div_resp').length;
    for (i = 0; i < a; i++) {
        document.getElementsByClassName('div_resp')[i].innerHTML = "";
    }
    nota = 0.0;
}

function presentarNota() {
    darRespuestaHtml("div_nota", "Nota: " + nota.toFixed(2) + " puntos sobre 10");
}

function deshabilitarForm() {
    document.getElementById("formulario").setAttribute("disabled", "");
    document.getElementById("fin").setAttribute("disabled", "");
}

// Correcciones

function corregirTodo() {
    var f = formElement;
    corregirCheckBox(f.P1, p1, "p1_");
    corregirCheckBox(f.P2, p2, "p2_");
    corregirCheckBox(f.P3, p3, "p3_");
    corregirSelectMultiple(f.P4, p4, "p4_");
    corregirTexto(f.P5, p5, "p5resp");
    corregirSelect(f.P6, p6, "p6resp");
    corregirSelect(f.P7, p7, "p7resp");
    corregirRadio(f.P8, p8, "p8_"); //radio
    corregirRadio(f.P9, p9, "p9_"); //radio
    corregirRadio(f.P10, p10, "p10_"); //radio
}

function corregirTexto(pregunta, respuesta, id) {
    if (pregunta.value == respuesta[0]) {
        darRespuestaHtml(id, "Correcto");
        colorearRespuesta(id, "darkgreen");
        document.getElementById(id).style.color = "lightgreen";
        nota += 1;
    } else {
        darRespuestaHtml(id, "Incorrecto, la respuesta correcta es:");
        darRespuestaHtml(id, respuesta[0]);
        colorearRespuesta(id, "red");
        nota -= 0.5;
    }
}

function corregirSelect(pregunta, respuesta, id) {
    if (pregunta.selectedIndex - 1 == respuesta[0]) {
        darRespuestaHtml(id, "Correcto");
        colorearRespuesta(id, "darkgreen");
        document.getElementById(id).style.color = "lightgreen";
        nota += 1;
    } else {
        var respString = pregunta.getElementsByTagName("option")[parseInt(respuesta[0]) + 1].innerHTML;
        darRespuestaHtml(id, "Incorrecto, la respuesta correcta es:");
        darRespuestaHtml(id, respString);
        colorearRespuesta(id, "red");
        nota -= 0.5;
    }
}

function corregirRadio(pregunta, respuesta, id) {
    for (i = 0; i < pregunta.length; i++) {
        if (pregunta[i].checked) {
            if (i == respuesta[0]) {
                nota += 1.0;
                colorearRespuesta(id + i, "darkgreen");
            } else {
                nota -= 0.5;
                colorearRespuesta(id + i, "red");
            }
        }
    }
    document.getElementById(id + respuesta[0]).style.color = "lightgreen";
}

function corregirCheckBox(pregunta, respuestas, id) { //Corrige preguntas de checkbox y radio
    var escorrecta = [];
    for (i = 0; i < pregunta.length; i++) {  //"P1" es el nombre asignado a todos los checkbox de la pregunta 1
        if (pregunta[i].checked) {
            escorrecta[i] = false;
            for (j = 0; j < respuestas.length; j++) {
                if (i == respuestas[j]) {
                    escorrecta[i] = true;
                }
            }
            //si es correcta sumamos y ponemos mensaje, si no es correcta restamos y ponemos mensaje.
            if (escorrecta[i]) {
                nota += 1.0 / respuestas.length;  //dividido por el número de respuestas correctas
                colorearRespuesta(id + i, "darkgreen");
            } else {
                nota -= 1.0 / respuestas.length;  //dividido por el número de respuestas correctas   
                colorearRespuesta(id + i, "red");
            }
        }
    }
    for (i = 0; i < pregunta.length; i++) {
        for (j = 0; j < respuestas.length; j++) {
            if (i == respuestas[j]) {
                document.getElementById(id + i).style.color = "lightgreen";
            }
        }

    }
}

function corregirSelectMultiple(pregunta, respuestas, id) {
    opciones = pregunta.options;
    var escorrecta = [];
    for (i = 0; i < opciones.length; i++) { //colorea de verde las respuestas
        for (j = 0; j < respuestas.length; j++) {
            if (i == respuestas[j]) {
                document.getElementById(id + i).style.color = "lightgreen";
            }
        }
    }
    for (i = 0; i < opciones.length; i++) {//corregir
        if (opciones[i].selected) {
            escorrecta[i] = false;
            for (j = 0; j < respuestas.length; j++) {
                if (opciones[i].value == respuestas[j]) {
                    escorrecta[i] = true;
                }
            }
            if (escorrecta[i]) { //marca la respuesta introducida como correcta o oncorrecta
                nota += 1.0 / respuestas.length;  //dividido por el número de respuestas correctas
                colorearRespuesta(id + i, "darkgreen");

            } else {
                nota -= 1.0 / respuestas.length;  //dividido por el número de respuestas correctas   
                colorearRespuesta(id + i, "red");
            }
        }
        opciones[i].selected = false; //deseleccionar
    }
}

//****************************************************************************************************
//Gestionar la presentación de las respuestas
function darRespuestaHtml(id, texto) {
    var p = document.createElement("p");
    var node = document.createTextNode(texto);
    p.appendChild(node);
    document.getElementById(id).appendChild(p);
}

function colorearRespuesta(id, color) {
    document.getElementById(id).style.backgroundColor = color;
}

//Comprobar que se han introducido datos en el formulario
function comprobar() {
    var f = formElement;
    if (comprobarChk(f.P1) && comprobarChk(f.P2) && comprobarChk(f.P3) && comprobarSelMul(f.P4)
        && comprobarText(f.P5) && comprobarSelect(f.P6) && comprobarSelect(f.P7)
        && comprobarChk(f.P8) && comprobarChk(f.P9) && comprobarChk(f.P10)) {
        return true;
    } else {
        alert("Faltan preguntas por responder");
        return false;
    }
}

function comprobarChk(pregunta) {
    var checked = false;
    for (i = 0; i < pregunta.length; i++) {
        if (pregunta[i].checked) checked = true;
    }
    return checked;
}

function comprobarSelMul(pregunta) {
    opciones = pregunta.options;
    var select = false;
    for (i = 0; i < opciones.length; i++) {//corregir
        if (opciones[i].selected) select = true;
    }
    return select;
}

function comprobarSelect(pregunta) {
    return (pregunta.selectedIndex != 0);
}

function comprobarText(pregunta) {
    return (pregunta.value != "");
}

function actualizarTemp() {
    time--;
    t = document.getElementById("temp");
    if (time >= 0) {
        if (time < 30) {
            //Rojo
            t.style.background = "#F21C1C";
        } else {
            if (time < 60) {
                t.style.background = "#D28808";
            } else {
                if (time < 120) {
                    t.style.background = "#A0D208";
                } else {
                    t.style.background = "#54AE06";
                }
            }
        }
        min = parseInt(time / 60, 10);
        sec = parseInt(time % 60, 10);

        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;

        document.getElementById('crono').innerHTML = min + ":" + sec;
    } else {
        alert("¡TIEMPO AGOTADO!")
        clearInterval(timer);
        corregirTodo();
        presentarNota();
        deshabilitarForm();
        window.scrollTo(0, 0);
    }
}

//funcion para hacer que el select multiple se pueda aplicar sin la tecla Ctrl
jQuery('option').mousedown(function (e) {
    e.preventDefault();
    jQuery(this).toggleClass('selected');

    jQuery(this).prop('selected', !jQuery(this).prop('selected'));
    return false;
});