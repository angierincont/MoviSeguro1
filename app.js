// Configuración Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCafzjXml_xI2xYQ8JoX1BErK0oy1Tlxe8",
    authDomain: "moviseguroapp.firebaseapp.com",
    projectId: "moviseguroapp",
    storageBucket: "moviseguroapp.firebasestorage.app",
    messagingSenderId: "469574868943",
    appId: "1:469574868943:web:e05795b368cc03364bfcba"
  };
  
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Servicios
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Registrar Usuario
  function registrarUsuario() {
    const nombre = document.getElementById("nombre").value;
    const celular = document.getElementById("celular").value;
    const email = document.getElementById("emailRegistro").value;
    const password = document.getElementById("passwordRegistro").value;
    const confirmar = document.getElementById("confirmarPassword").value;
  
    if (password !== confirmar) {
      alert("❌ Las contraseñas no coinciden");
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
        window.location.href = "login.html";
      })
      .catch(error => {
        alert("❌ Error: el usuario ya existe o los datos son incorrectos.");
      });
  }
  
  // Iniciar sesión
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
  
  // Mostrar u ocultar contraseña
  function togglePassword(idInput) {
    const campo = document.getElementById(idInput);
    campo.type = campo.type === "password" ? "text" : "password";
  }
  
  // Verificar coincidencia de contraseñas
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
  
