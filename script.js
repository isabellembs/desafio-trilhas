document.addEventListener("DOMContentLoaded", function () {
  // Referências aos elementos do formulário
  const form = document.querySelector("form");
  const inputs = form.querySelectorAll("input, select");
  const submitButton = document.querySelector(".btn-primary");
  const successMessage = document.getElementById("success-message");
  const formContainer = document.querySelector(".form-container form");
  const countdownElement = document.getElementById("countdown");

  // Referências aos campos de senha
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmar-senha");
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  const strengthLevel = document.getElementById("strength-level");
  const strengthText = document.getElementById("strength-text");
  const passwordStrength = document.getElementById("password-strength");

  // Referências aos campos numéricos
  const cpfInput = document.getElementById("cpf");
  const telefoneInput = document.getElementById("telefone");
  const cepInput = document.getElementById("cep");
  const numeroInput = document.getElementById("numero");

  // Referências aos campos de upload
  const documentoUpload = document.getElementById("upload-documento");
  const comprovanteUpload = document.getElementById("upload-comprovante");
  const documentoInput = document.getElementById("documento");
  const comprovanteInput = document.getElementById("comprovante");

  // Função para permitir apenas números
  function apenasNumeros(e) {
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    // Garantir que seja um número e parar o keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  }

  //Máscara de CPF
  function mascaraCPF(e) {
    let valor = e.target.value;
    valor = valor.replace(/\D/g, ""); // Remove tudo o que não é dígito

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    if (valor.length > 9) {
      valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, "$1.$2.$3");
    } else if (valor.length > 3) {
      valor = valor.replace(/^(\d{3})(\d{0,3}).*/, "$1.$2");
    }

    e.target.value = valor;
  }

  //Máscara de telefone
  function mascaraTelefone(e) {
    let valor = e.target.value;
    valor = valor.replace(/\D/g, ""); // Remove tudo o que não é dígito

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
    }

    e.target.value = valor;
  }

  // Máscara de CEP
  function mascaraCEP(e) {
    let valor = e.target.value;
    valor = valor.replace(/\D/g, ""); // Remove tudo o que não é dígito

    if (valor.length > 8) {
      valor = valor.substring(0, 8);
    }

    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d{0,3}).*/, "$1-$2");
    }

    e.target.value = valor;
  }

  // Limitar número da casa a apenas números
  function apenasNumeroCasa(e) {
    let valor = e.target.value;
    valor = valor.replace(/\D/g, ""); // Remove tudo o que não é dígito
    e.target.value = valor;
  }

  // Configurar os campos de upload
  function configurarUpload(uploadArea, inputFile) {
    uploadArea.addEventListener("click", function () {
      inputFile.click();
    });

    inputFile.addEventListener("change", function () {
      const fileSelected = this.files[0];
      const fileNameDisplay = uploadArea.querySelector(".file-selected");
      const uploadText = uploadArea.querySelector(".upload-text");

      if (fileSelected) {
        fileNameDisplay.textContent = `Arquivo selecionado: ${fileSelected.name}`;
        fileNameDisplay.style.display = "block";
        uploadText.style.display = "none";
      } else {
        fileNameDisplay.style.display = "none";
        uploadText.style.display = "block";
      }

      // Limpar mensagem de erro se houver
      const errorElement = document.getElementById(`${inputFile.id}-error`);
      if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.remove("visible");
      }
    });
  }

  // Função para alternar visibilidade da senha
  function configurarCamposSenha() {
    togglePasswordButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const passwordField = this.closest(".password-field");
        const passwordInput = passwordField.querySelector("input");
        const eyeIcon = this.querySelector(".eye-icon");
        const eyeOffIcon = this.querySelector(".eye-off-icon");

        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          eyeIcon.style.display = "none";
          eyeOffIcon.style.display = "block";
        } else {
          passwordInput.type = "password";
          eyeIcon.style.display = "block";
          eyeOffIcon.style.display = "none";
        }
      });
    });
  }

  // Função para verificar força da senha
  function verificarForcaSenha(senha) {
    let pontos = 0;

    // Verificar comprimento
    if (senha.length >= 8) pontos += 1;
    if (senha.length >= 12) pontos += 1;

    // Verificar complexidade
    if (/[A-Z]/.test(senha)) pontos += 1; // Letras maiúsculas
    if (/[a-z]/.test(senha)) pontos += 1; // Letras minúsculas
    if (/[0-9]/.test(senha)) pontos += 1; // Números
    if (/[^A-Za-z0-9]/.test(senha)) pontos += 1; // Caracteres especiais

    // Classificar força
    if (senha.length === 0) {
      return { nivel: 0, texto: "Força da senha" };
    } else if (pontos <= 2) {
      return { nivel: 1, texto: "Fraca" };
    } else if (pontos <= 4) {
      return { nivel: 2, texto: "Média" };
    } else if (pontos <= 5) {
      return { nivel: 3, texto: "Boa" };
    } else {
      return { nivel: 4, texto: "Forte" };
    }
  }

  // Atualizar indicador de força da senha
  function atualizarForcaSenha() {
    senhaInput.addEventListener("input", function () {
      const senha = this.value;
      const forca = verificarForcaSenha(senha);

      // Remover classes anteriores
      passwordStrength.classList.remove(
        "strength-weak",
        "strength-medium",
        "strength-good",
        "strength-strong"
      );

      // Atualizar texto e barra de força
      strengthText.textContent = forca.texto;

      if (forca.nivel === 0) {
        strengthLevel.style.width = "0";
      } else if (forca.nivel === 1) {
        passwordStrength.classList.add("strength-weak");
      } else if (forca.nivel === 2) {
        passwordStrength.classList.add("strength-medium");
      } else if (forca.nivel === 3) {
        passwordStrength.classList.add("strength-good");
      } else {
        passwordStrength.classList.add("strength-strong");
      }
    });
  }

  // Adicionar os eventos aos campos
  if (cpfInput) {
    cpfInput.addEventListener("keydown", apenasNumeros);
    cpfInput.addEventListener("input", mascaraCPF);
  }

  if (telefoneInput) {
    telefoneInput.addEventListener("keydown", apenasNumeros);
    telefoneInput.addEventListener("input", mascaraTelefone);
  }

  if (cepInput) {
    cepInput.addEventListener("keydown", apenasNumeros);
    cepInput.addEventListener("input", mascaraCEP);
  }

  if (numeroInput) {
    numeroInput.addEventListener("keydown", apenasNumeros);
    numeroInput.addEventListener("input", apenasNumeroCasa);
  }

  // Configurar os campos de upload
  if (documentoUpload && documentoInput) {
    configurarUpload(documentoUpload, documentoInput);
  }

  if (comprovanteUpload && comprovanteInput) {
    configurarUpload(comprovanteUpload, comprovanteInput);
  }

  // Configurar campos de senha
  configurarCamposSenha();
  atualizarForcaSenha();

  // Função para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Função para validar CPF 
  function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    return cpf.length === 11;
  }

  // Função para validar telefone
  function isValidPhone(phone) {
    phone = phone.replace(/[^\d]/g, ""); 
    return phone.length >= 10 && phone.length <= 11;
  }

  // Função para validar CEP
  function isValidCEP(cep) {
    cep = cep.replace(/[^\d]/g, ""); 
    return cep.length === 8;
  }

  // Função para mostrar erro
  function showError(input, message) {
    const formGroup = input.closest(".form-group");
    const errorElement =
      formGroup.querySelector(".error-message") ||
      document.getElementById(`${input.id}-error`);

    formGroup.classList.add("error");

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("visible");
    }

    return false;
  }

  // Função para limpar erro
  function clearError(input) {
    const formGroup = input.closest(".form-group");
    const errorElement =
      formGroup.querySelector(".error-message") ||
      document.getElementById(`${input.id}-error`);

    formGroup.classList.remove("error");

    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.remove("visible");
    }
  }

  // Validação em tempo real para os campos
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      clearError(this);
    });
  });

  // Função para validar um campo específico
  function validateField(input) {
    // Limpa o erro primeiro
    clearError(input);

    // Verifica se o campo está vazio (exceto complemento, documento e comprovante)
    if (
      input.id !== "complemento" &&
      input.id !== "documento" &&
      input.id !== "comprovante" &&
      !input.value.trim()
    ) {
      return showError(input, "Este campo é obrigatório");
    }

    // Validações específicas por tipo de campo
    switch (input.id) {
      case "email":
        if (!isValidEmail(input.value)) {
          return showError(input, "Digite um email válido");
        }
        break;

      case "cpf":
        if (!isValidCPF(input.value)) {
          return showError(input, "Digite um CPF válido");
        }
        break;

      case "telefone":
        if (!isValidPhone(input.value)) {
          return showError(input, "Digite um telefone válido");
        }
        break;

      case "cep":
        if (!isValidCEP(input.value)) {
          return showError(input, "Digite um CEP válido");
        }
        break;

      case "senha":
        if (input.value.length < 6) {
          return showError(input, "A senha deve ter pelo menos 6 caracteres");
        }
        break;

      case "confirmar-senha":
        const senhaInput = document.getElementById("senha");
        if (input.value !== senhaInput.value) {
          return showError(input, "As senhas não coincidem");
        }
        break;

      case "usuario":
        if (input.value.length < 4) {
          return showError(
            input,
            "O nome de usuário deve ter pelo menos 4 caracteres"
          );
        }
        break;
    }

    return true;
  }

  // Validação do formulário completo
  function validateForm() {
    let isValid = true;

    // Validar todos os campos 
    inputs.forEach((input) => {
      if (
        input.id !== "documento" &&
        input.id !== "comprovante" &&
        input.id !== "termos"
      ) {
        if (!validateField(input)) {
          isValid = false;
        }
      }
    });

    // Validar checkbox dos termos
    const termosCheckbox = document.getElementById("termos");
    const termosError = document.getElementById("termos-error");

    if (!termosCheckbox.checked) {
      termosError.textContent =
        "Você precisa aceitar os termos de uso para continuar";
      termosError.classList.add("visible");
      isValid = false;
    } else {
      termosError.textContent = "";
      termosError.classList.remove("visible");
    }

    return isValid;
  }

  // Função para salvar os dados no localStorage
  function saveFormData() {
    const formData = {};

    // Coletar dados de todos os campos
    inputs.forEach((input) => {
      if (
        input.id !== "confirmar-senha" &&
        input.id !== "documento" &&
        input.id !== "comprovante" &&
        input.id !== "termos"
      ) {
        formData[input.id] = input.value;
      }
    });

    // Adicionar a área de interesse selecionada
    const selectedTrack = document.querySelector(".track-option.selected");
    if (selectedTrack) {
      formData["area_interesse"] =
        selectedTrack.querySelector(".track-name").textContent;
    }

    // Salvar no localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    // Também salvar como usuário individual para facilitar o login
    localStorage.setItem(`user_${formData.usuario}`, JSON.stringify(formData));

    return formData;
  }


  function showSuccessAndRedirect() {
    alert("Inscrição concluída com sucesso!");

    // Esconder o formulário e mostrar a mensagem de sucesso
    formContainer.style.display = "none";
    successMessage.style.display = "block";

    let countdown = 5;
    countdownElement.textContent = countdown;

    const interval = setInterval(() => {
      countdown--;
      countdownElement.textContent = countdown;

      if (countdown <= 0) {
        clearInterval(interval);
        window.location.href = "login.html";
      }
    }, 1000);
  }

  // Adicionar funcionalidade para selecionar área de interesse
  const trackOptions = document.querySelectorAll(".track-option");
  trackOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remover seleção anterior
      trackOptions.forEach((opt) => opt.classList.remove("selected"));
      // Adicionar seleção ao item clicado
      this.classList.add("selected");
    });
  });

  // Manipular envio do formulário
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      const userData = saveFormData();
      console.log("Dados salvos:", userData);
      showSuccessAndRedirect();
    } else {
      // Verificar especificamente se o erro é nos termos
      const termosCheckbox = document.getElementById("termos");
      if (!termosCheckbox.checked) {
        alert("Você precisa aceitar os termos de uso para continuar.");
      }

      // Rolar até o primeiro erro
      const firstError = document.querySelector(".form-group.error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (!termosCheckbox.checked) {
        // Se não houver erro nos campos mas os termos não estiverem marcados
        document
          .getElementById("termos-error")
          .scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
});
