const input = document.getElementById("input");
const table = document.getElementById("tabla");
const boton = document.getElementById("boton");
const form = document.getElementById("form");
const screenbtn = document.getElementById("startFull");
let tareas = [];
function agregarTarea() {
  const fila = document.createElement("tr");

  fila.innerHTML = `
                    <td> <input type="checkbox" id="chk" onClick="completar()" /> </td>
                    <td style="flex-grow: 2" >${input.value}</td>               
                    <td> <span onClick="share()" class="fas fa-share-alt" > </span> </td>
                    <td> <span onClick="borrar()" class="fas fa-trash" >  </span> </td>
                    `;

  tabla.appendChild(fila);
  
  
}

boton.addEventListener("click", function (e) {
  if (input.value === "") {
    validacion("introduce una tarea", "fallo");
  } else {
    agregarTarea();
    validacion("Tarea añadida con éxito", "exito");
    agregarItem(input.value, getLocation());
    guardarDB();
  }
  
  form.reset();
});



function borrar(event) {
  texto = this.event.target.parentElement.parentElement.children[1].innerHTML;
  this.event.target.parentElement.parentElement.remove();
  eliminarDB(texto);
  
}

function copiarText(event){
  return this.event.target.parentElement.parentElement.children[1].innerHTML;
}

function validacion(mensaje, clase) {
  const div = document.createElement("div");
  div.className = clase;
  div.appendChild(document.createTextNode(mensaje));

  const titulo = document.querySelector("h1");

  titulo.insertBefore(div, null);

  setTimeout(function () {
    document.querySelector(`.${clase}`).remove();
  }, 3000);
}



function completar(event) {

  if (this.event.target.checked) {
    this.event.target.parentElement.parentElement.children[0].classList.add("completado");
    this.event.target.parentElement.parentElement.children[1].classList.add("completado");
  } else {
    this.event.target.parentElement.parentElement.children[1].classList.remove(
      "completado"
    );
    this.event.target.parentElement.parentElement.children[0].classList.remove(
      "completado"
    );
    
   
  }
  
}

function share() {
  if (!("share" in navigator)) {
    alert('Web Share API not supported.');
    return;
  }

  navigator.share({
      title: copiarText(onclick),
      text: 'Can I rely on the Web Platform features to build my app? An overview of the device integration HTML5 APIs',
      url: copiarText(onclick)
    })
    .then(() => console.log('Successful share'))
    .catch(error => console.log('Error sharing:', error));
}

const agregarItem = (tarea, geo) => {
  let item = {
    tarea: tarea,
    estado: false,
    geo: geo
  }
  tareas.push(item);
}
const guardarDB = () => {
  localStorage.setItem('tarea', JSON.stringify(tareas));
  llenarDB();
}

llenarDB = () => {
  tabla.innerHTML = '';
  tareas = JSON.parse(localStorage.getItem('tarea'));
  if(tareas === null){
    tareas = [];
  }else{
    tareas.forEach(element => {
      tabla.innerHTML += `
      <td> <input type="checkbox" id="chk" onClick="completar()" /> </td>
      <td style="flex-grow: 2" >${element.tarea}</td>               
      <td> <span onClick="share()" class="fas fa-share-alt" > </span> </td>
      <td> <span onClick="borrar()" class="fas fa-trash" >  </span> </td>
      `;
    });
  }
}

eliminarDB = (tarea1) => {
  let indexA;
  tareas.forEach((element, index) => {
  
    if(element.tarea === tarea1){
      indexA = index;
      
    }
    
  });
  
  tareas.splice(indexA,1);
  guardarDB();
}

document.addEventListener('DOMContentLoaded', llenarDB);

let x = document.getElementById("geo");

function getLocation() {
  if(navigator.geolocation){
    return navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    x.innerHTML = "No es compatible con el navegador"
  }
}

function showPosition(position) {
  console.log((position.coords.latitude + ", " + position.coords.longitude).innerHTML);
}

var $ = document.querySelector.bind(document);
var $$ = function (selector) {
  return [].slice.call(document.querySelectorAll(selector), 0);
}




var prefix = null;
if ('requestFullscreen' in document.documentElement) {
  prefix = 'fullscreen';
} else if ('mozRequestFullScreen' in document.documentElement) {
  prefix = 'mozFullScreen';
} else if ('webkitRequestFullscreen' in document.documentElement) {
  prefix = 'webkitFullscreen';
} else if ('msRequestFullscreen') {
  prefix = 'msFullscreen';
}

var onFullscreenChange = function () {
  var elementName = 'not set';
  if (document[prefix + 'Element']) {
    elementName = document[prefix + 'Element'].nodeName;
  }
  if(elementName ==='HTML'){
    screenbtn.className ="fas fa-compress";
  }else{
    screenbtn.className = "fas fa-expand";
  }
  
  
  logChange('New fullscreen element is ' + elementName + '');
  onFullscreenHandler(!!document[prefix + 'Element']);
}

if (document[prefix + 'Enabled']) {
  var onFullscreenHandler = function (started) {
    $('#exit').style.display = started ? 'inline-block' : 'none';
    $$('.start').forEach(function (x) {
      x.style.display = started ? 'none' : 'inline-block';
    });
  };

  document.addEventListener(prefix.toLowerCase() + 'change', onFullscreenChange);

  var goFullScreen = null;
  var exitFullScreen = null;
  if ('requestFullscreen' in document.documentElement) {
    goFullScreen = 'requestFullscreen';
    exitFullScreen = 'exitFullscreen';
  } else if ('mozRequestFullScreen' in document.documentElement) {
    goFullScreen = 'mozRequestFullScreen';
    exitFullScreen = 'mozCancelFullScreen';
  } else if ('webkitRequestFullscreen' in document.documentElement) {
    goFullScreen = 'webkitRequestFullscreen';
    exitFullScreen = 'webkitExitFullscreen';
  } else if ('msRequestFullscreen') {
    goFullScreen = 'msRequestFullscreen';
    exitFullScreen = 'msExitFullscreen';
  }

  var goFullscreenHandler = function (element) {
    return function () {
      var maybePromise = element[goFullScreen]();
      if (maybePromise && maybePromise.catch) {
        maybePromise.catch(function (err) {
          logChange('Cannot acquire fullscreen mode: ' + err);
        });
      }
    };
  };


      $('#startFull').addEventListener('click', goFullscreenHandler(document.documentElement));
      $('#startFull').addEventListener('click', function () {
        document[exitFullScreen]();
      });
 
  

  
};
