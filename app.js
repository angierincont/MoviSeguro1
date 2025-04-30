// =======================
// 🔥 CONFIGURACIÓN FIREBASE
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyCafzjXml_xI2xYQ8JoX1BErK0oy1Tlxe8",
  authDomain: "moviseguroapp.firebaseapp.com",
  projectId: "moviseguroapp",
  storageBucket: "moviseguroapp.firebasestorage.app",
  messagingSenderId: "469574868943",
  appId: "1:469574868943:web:e05795b368cc03364bfcba"
};

// ✅ Asegúrate de que los scripts de Firebase están cargados en tu HTML antes de esto
firebase.initializeApp(firebaseConfig);

// Servicios de Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// =======================
// 👤 REGISTRO DE USUARIOS
// =======================
function registrarUsuario() {
  const nombre = document.getElementById("nombre").value;
  const celular = document.getElementById("celular").value;
  const email = document.getElementById("correo").value;
  const password = document.getElementById("passwordRegistro").value;
  const confirmar = document.getElementById("confirmarPassword").value;

  if (password !== confirmar) {
    alert("❌ Las contraseñas no coinciden");
    return;
  }

  if (password.length > 8) {
    alert("❌ La contraseña debe tener máximo 8 caracteres.");
    return;
  }

  if (!nombre.match(/^[a-zA-Z\s]+$/)) {
    alert("❌ El nombre solo debe contener letras y espacios.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db.collection("usuarios").doc(cred.user.uid).set({
        nombre,
        celular,
        email
      });
    })
    .then(() => {
      alert("✅ Usuario registrado correctamente");
      window.location.href = "index.html";
    })
    .catch(error => {
      alert("❌ Error: el usuario ya existe o los datos son incorrectos.");
      console.error(error);
    });
}

// =======================
// 🔐 INICIO DE SESIÓN
// =======================
function iniciarSesion() {
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("passwordLogin").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Inicio de sesión exitoso.',
        confirmButtonText: 'Continuar'
      }).then(() => {
        window.location.href = "pagina-principal.html";
      });
    })
    .catch(error => {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El usuario y/o contraseña no existen. Por favor regístrate.'
      });
    });
}

// =======================
// 👁️ TOGGLE VISIBILIDAD PASSWORD
// =======================
function togglePassword(idInput) {
  const campo = document.getElementById(idInput);
  campo.type = campo.type === "password" ? "text" : "password";
}

// =======================
// 🔄 VALIDAR COINCIDENCIA PASSWORD
// =======================
function validarCoincidencia() {
  const pass = document.getElementById("passwordRegistro").value;
  const confirm = document.getElementById("confirmarPassword").value;
  const mensaje = document.getElementById("mensajeCoincidencia");

  if (confirm === "") {
    mensaje.textContent = "";
  } else if (pass === confirm) {
    mensaje.textContent = "✔️ Coinciden";
    mensaje.style.color = "green";
  } else {
    mensaje.textContent = "❌ No coinciden";
    mensaje.style.color = "red";
  }
}

// =======================
// 🌐 MULTILENGUAJE Y TABS
// =======================
const traducciones = {
  es: {
    titulo: "Movilidad Bogotá",
    planear: "Planear",
    rutas: "Rutas",
    emergencias: "Emergencias",
    camaras: "Cámaras",
    menu: "Menú",
    contenido: {
      planear: "Aquí puedes planear tu viaje.",
      rutas: "Consulta rutas disponibles.",
      emergencias: "Contacta con servicios de emergencia.",
      camaras: "Vista de cámaras de seguridad.",
      menu: "Opciones de configuración y ajustes."
    }
  },
  en: {
    titulo: "Bogotá Mobility",
    planear: "Plan",
    rutas: "Routes",
    emergencias: "Emergency",
    camaras: "Cameras",
    menu: "Menu",
    contenido: {
      planear: "Plan your trip here.",
      rutas: "Check available routes.",
      emergencias: "Contact emergency services.",
      camaras: "View security cameras.",
      menu: "Configuration and settings."
    }
  }
};

let idiomaActual = "es";
let tabActual = "planear";

function cambiarIdioma(nuevoIdioma) {
  idiomaActual = nuevoIdioma;
  const t = traducciones[idiomaActual];

  document.getElementById("titulo").textContent = t.titulo;
  document.getElementById("tabPlanear").textContent = t.planear;
  document.getElementById("tabRutas").textContent = t.rutas;
  document.getElementById("tabEmergencias").textContent = t.emergencias;
  document.getElementById("tabCamaras").textContent = t.camaras;
  document.getElementById("tabMenu").textContent = t.menu;

  cambiarTab(tabActual);
}

function cambiarTab(tab) {
  tabActual = tab;
  const t = traducciones[idiomaActual];
  document.getElementById("tab-content").textContent = t.contenido[tab];
}

// Escucha del selector de idioma
document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("languageSelect");
  if (selector) {
    selector.addEventListener("change", function () {
      cambiarIdioma(this.value);
    });
  }
  cambiarIdioma(idiomaActual);
});

function cambiarTab(tab) {
  tabActual = tab;
  const t = traducciones[idiomaActual];
  const contenido = document.getElementById("tab-content");

  switch (tab) {
    case "planear":
      contenido.innerHTML = `
        <h2>🗺️ ${t.planear}</h2>
        <p>${t.contenido.planear}</p>
        <input id="origen" type="text" placeholder="📍 Origen" class="input-tab">
        <input id="destino" type="text" placeholder="🏁 Destino" class="input-tab">
        <button id="btnRuta" class="boton-tab">Calcular Ruta</button>
        <div id="resultadoRuta" class="ruta-simulada"></div>
      `;
    
      document.getElementById("btnRuta").addEventListener("click", () => {
        const origen = document.getElementById("origen").value;
        const destino = document.getElementById("destino").value;
        const resultado = document.getElementById("resultadoRuta");
    
        if (origen && destino) {
          resultado.innerHTML = `
            <p><strong>Ruta simulada:</strong> de <em>${origen}</em> a <em>${destino}</em></p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Bogota_Map.svg/800px-Bogota_Map.svg.png" 
                 alt="Ruta simulada" class="imagen-ruta">
            <p>Duración estimada: 35 min | Transbordos: 1</p>
          `;
        } else {
          resultado.innerHTML = `<p style="color:red">⚠️ Por favor ingresa ambos campos.</p>`;
        }
      });
      break;
    
    case "rutas":
      contenido.innerHTML = `
        <h2>🚌 ${t.rutas}</h2>
        <p>${t.contenido.rutas}</p>
        <ul class="lista-tab">
          <li>🚍 Ruta A - Suba ↔ Centro</li>
          <li>🚍 Ruta B - Usaquén ↔ Bosa</li>
          <li>🚍 Ruta C - Kennedy ↔ Chapinero</li>
        </ul>
      `;
      break;

    case "emergencias":
      contenido.innerHTML = `
        <h2>🚨 ${t.emergencias}</h2>
        <p>${t.contenido.emergencias}</p>
        <ul class="lista-tab">
          <li>📞 Policía: 123</li>
          <li>🚑 Ambulancia: 125</li>
          <li>🚒 Bomberos: 119</li>
        </ul>
        <button class="boton-tab rojo">Llamar ahora</button>
      `;
      break;

    case "camaras":
      contenido.innerHTML = `
        <h2>🎥 ${t.camaras}</h2>
        <p>${t.contenido.camaras}</p>
        <div class="camara-grid">
          <div class="camara-box">📷 Cámara 1<br><span class="estado">Zona: 7ma con 72</span></div>
          <div class="camara-box">📷 Cámara 2<br><span class="estado">Zona: Caracas con 1ra</span></div>
          <div class="camara-box">📷 Cámara 3<br><span class="estado">Zona: NQS con 68</span></div>
        </div>
      `;
      break;

    case "menu":
      contenido.innerHTML = `
        <h2>⚙️ ${t.menu}</h2>
        <p>${t.contenido.menu}</p>
        <label for="languageSelect">🌐 Seleccionar idioma:</label>
        <select id="languageSelect">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
        <br><br>
        <button class="boton-tab">🔓 Cerrar sesión</button>
      `;
      // Volver a asignar el evento de cambio de idioma
      document.getElementById("languageSelect").addEventListener("change", function () {
        cambiarIdioma(this.value);
      });
      break;
  }
}

// cerrar sesion

document.querySelector(".boton-tab").addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      Swal.fire({
        icon: 'info',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente.',
      }).then(() => {
        window.location.href = "index.html"; // O a login
      });
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
});
