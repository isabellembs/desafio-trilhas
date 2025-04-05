document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const btnLimpar = document.getElementById("btn-limpar");

  // Função para validar o login
  function validateLogin(username, password) {
    // Verificar se o usuário existe no localStorage
    const userData = localStorage.getItem(`user_${username}`);

    if (!userData) {
      return {
        valid: false,
        message: "Usuário não encontrado. Verifique seu ID de usuário.",
      };
    }

    const user = JSON.parse(userData);
    if (user.senha === password) {
      return { valid: true };
    } else {
      return { valid: false, message: "Senha incorreta. Verifique sua senha." };
    }
  }

  // Função para mostrar erro
  function showError(input, message) {
    const formGroup = input.closest(".form-group");
    const errorElement = document.getElementById(`${input.id}-error`);

    formGroup.classList.add("error");

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("visible");
    }
  }

  // Função para limpar erro
  function clearError(input) {
    const formGroup = input.closest(".form-group");
    const errorElement = document.getElementById(`${input.id}-error`);

    formGroup.classList.remove("error");

    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("visible");
    }
  }

  // Limpar campos
  btnLimpar.addEventListener("click", function () {
    loginForm.reset();
    loginError.style.display = "none";

    // Limpar erros
    clearError(document.getElementById("login-usuario"));
    clearError(document.getElementById("login-senha"));
  });

  // Manipular envio do formulário de login
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("login-usuario").value;
    const password = document.getElementById("login-senha").value;

    // Validar campos vazios
    let isValid = true;

    if (!username.trim()) {
      showError(
        document.getElementById("login-usuario"),
        "Digite seu nome de usuário"
      );
      isValid = false;
    } else {
      clearError(document.getElementById("login-usuario"));
    }

    if (!password.trim()) {
      showError(document.getElementById("login-senha"), "Digite sua senha");
      isValid = false;
    } else {
      clearError(document.getElementById("login-senha"));
    }

    if (!isValid) {
      return;
    }

    // Verificar credenciais
    const result = validateLogin(username, password);

    if (result.valid) {
      alert(
        "Login realizado com sucesso! ID de usuário e senha são equivalentes."
      );


    } else {
      loginError.textContent = result.message;
      loginError.style.display = "block";
    }
  });
});
