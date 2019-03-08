var formElement = null;
//respuestas correctas
var p1 = [];
var p2 = [];
var p3 = [];
var p4 = [];
var p5a = [];
var p5b = [];
var p5c = [];
var p5d = [];
var p6a = [];
var p6b = [];
var p6c = [];

var p8 = [];
var p9a = [];
var p9b = [];
var p9c = [];
var p10 = [];
var nota = 0;  //nota de la prueba

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

    //CORREGIR al apretar el botón
    formElement = document.getElementById('formulario');
    formElement.onsubmit = function () {
        inicializar();
        //if (comprobar()) {
        mostrarRespuestas();
        corregirP1();
        //}
        return false;
    }

    //LEER XML de xml/preguntas.xml
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            gestionarXml(this);
        }
    };
    xhttp.open("GET", "xml/preguntas.xml", true);
    xhttp.send();
}

//****************************************************************************************************
// Recuperamos las respuestas del fichero XML xml/preguntas.xml
// xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml) {
    var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc

    var resp1 = xmlDoc.getElementById("P1").getElementsByTagName('answer').length;
    for (i = 0; i < resp1; i++) {
        p1[i] = xmlDoc.getElementById("P1").getElementsByTagName('answer')[i].innerHTML;
    }

    var resp2 = xmlDoc.getElementById("P2").getElementsByTagName('answer').length;
    for (i = 0; i < resp2; i++) {
        p2[i] = xmlDoc.getElementById("P2").getElementsByTagName('answer')[i].innerHTML;
    }

    var resp3 = xmlDoc.getElementById("P3").getElementsByTagName('answer').length;
    for (i = 0; i < resp3; i++) {
        p3[i] = xmlDoc.getElementById("P3").getElementsByTagName("answer")[i].innerHTML;
    }

    var resp4 = xmlDoc.getElementById("P4").getElementsByTagName('answer').length;
    for (i = 0; i < resp4; i++) {
        p4[i] = xmlDoc.getElementById("P4").getElementsByTagName("answer")[i].innerHTML;
    }

    p5a[0] = xmlDoc.getElementById("P5a").getElementsByTagName("answer")[0].innerHTML;
    p5b[0] = xmlDoc.getElementById("P5b").getElementsByTagName("answer")[0].innerHTML;
    p5c[0] = xmlDoc.getElementById("P5c").getElementsByTagName("answer")[0].innerHTML;
    p5d[0] = xmlDoc.getElementById("P5d").getElementsByTagName("answer")[0].innerHTML;

    p6a[0] = xmlDoc.getElementById("P6a").getElementsByTagName("answer")[0].innerHTML;
    p6b[0] = xmlDoc.getElementById("P6b").getElementsByTagName("answer")[0].innerHTML;
    p6c[0] = xmlDoc.getElementById("P6c").getElementsByTagName("answer")[0].innerHTML;

    p8[0] = xmlDoc.getElementById("P8").getElementsByTagName("answer")[0].innerHTML;

    p9a[0] = xmlDoc.getElementById("P9a").getElementsByTagName("answer")[0].innerHTML;
    p9b[0] = xmlDoc.getElementById("P9b").getElementsByTagName("answer")[0].innerHTML;
    p9c[0] = xmlDoc.getElementById("P9c").getElementsByTagName("answer")[0].innerHTML;

    p10[0] = xmlDoc.getElementById("P10").getElementsByTagName("answer")[0].innerHTML;

}

//****************************************************************************************************
function inicializar() {
    document.getElementById('resultadosDiv').innerHTML = "";
    nota = 0.0;
}

function presentarNota() {
    darRespuestaHtml("Nota: " + nota + " puntos sobre 10");
}

// Correcciones

function mostrarRespuestas() {
    darRespuestaHtml("RespuestasP1="+p1.length);
    darRespuestaHtml("RespuestasP2="+p2.length);
    darRespuestaHtml("RespuestasP3="+p3.length);
    darRespuestaHtml("RespuestasP4="+p4.length);
    darRespuestaHtml("RespuestasP5="+p5a.length);
    darRespuestaHtml("RespuestasP5="+p5b.length);
    darRespuestaHtml("RespuestasP5="+p5c.length);
    darRespuestaHtml("RespuestasP5="+p5d.length);

}

function corregirP1() {
    //Para cada opción mira si está checkeada, si está checkeada mira si es correcta y lo guarda en un array escorrecta[]
    var f = formElement;
    var escorrecta = [];
    for (i = 0; i < f.P1.length; i++) {  //"P1" es el nombre asignado a todos los checkbox de la pregunta 1
        if (f.P1[i].checked) {
            escorrecta[i] = false;
            for (j = 0; j < p1.length; j++) {
                if (i == p1[j]) {
                    escorrecta[i] = true;
                }
            }
            //si es correcta sumamos y ponemos mensaje, si no es correcta restamos y ponemos mensaje.
            if (escorrecta[i]) {
                nota += 1.0 / p1.length;  //dividido por el número de respuestas correctas   
                darRespuestaHtml("P1: " + i + " correcta");
            } else {
                nota -= 1.0 / p1.length;  //dividido por el número de respuestas correctas   
                darRespuestaHtml("P1: " + i + " incorrecta");
            }
        }
    }
}

//****************************************************************************************************
//Gestionar la presentación de las respuestas
function darRespuestaHtml(r) {
    var p = document.createElement("p");
    var node = document.createTextNode(r);
    p.appendChild(node);
    document.getElementById('resultadosDiv').appendChild(p);

}