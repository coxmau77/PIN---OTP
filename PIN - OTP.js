/* ========================================================= */
/* CONFIGURACIÓN                                             */
/* ========================================================= */

const VALID_CODE = "123456";
const CODE_LENGTH = 6;

/* ========================================================= */
/* ELEMENTOS DOM                                             */
/* ========================================================= */

const input = document.getElementById("code");
const dots = document.querySelectorAll(".code-visual span");
const keys = document.querySelectorAll(".keypad button");
const status = document.getElementById("code-status");

/* ========================================================= */
/* RENDER VISUAL                                             */
/* ========================================================= */

function updateDots(value, state = "default") {
  dots.forEach((dot, index) => {
    if (state === "error") {
      dot.style.backgroundColor = "var(--danger-clr)";
      return;
    }

    dot.style.backgroundColor =
      index < value.length
        ? "var(--main-clr)"
        : "oklch(from var(--on-surface) l c h / 0.25)";
  });
}

function updateStatus(message = "", tone = "neutral") {
  status.textContent = message;

  status.style.color =
    tone === "error"
      ? "var(--danger-clr)"
      : "oklch(from var(--on-surface) l c h / 0.65)";

  status.dataset.visible = message ? "true" : "false";
}

/* ========================================================= */
/* VALIDACIÓN (PURO)                                         */
/* ========================================================= */

function validateCode(value, reference) {
  return value === reference;
}

/* ========================================================= */
/* RESPUESTAS                                               */
/* ========================================================= */

function handleSuccess() {
  updateStatus("Código correcto. Ingresando…");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 300);
}

function handleError() {
  updateDots(input.value, "error");
  updateStatus("La clave de ingreso es incorrecta.", "error");
}

/* ========================================================= */
/* CONTROL CENTRAL                                           */
/* ========================================================= */

function handleInputChange() {
  // Reset automático si el usuario corrige
  if (input.value.length < CODE_LENGTH) {
    updateStatus();
    updateDots(input.value);
    return;
  }

  // Validación solo cuando está completo
  const isValid = validateCode(input.value, VALID_CODE);
  isValid ? handleSuccess() : handleError();
}

/* ========================================================= */
/* KEYPAD (BOTONES)                                         */
/* ========================================================= */

keys.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key;
    const action = btn.dataset.action;

    if (action === "delete") {
      input.value = input.value.slice(0, -1);
    }

    if (key && input.value.length < CODE_LENGTH) {
      input.value += key;
    }

    handleInputChange();
  });
});

/* ========================================================= */
/* TECLADO FÍSICO                                           */
/* ========================================================= */

document.addEventListener("keydown", (event) => {
  const { key } = event;

  // Números
  if (/^\d$/.test(key) && input.value.length < CODE_LENGTH) {
    input.value += key;
    handleInputChange();
  }

  // Borrar
  if (key === "Backspace" || key === "Delete") {
    input.value = input.value.slice(0, -1);
    handleInputChange();
  }

  // Evitar submit accidental
  if (key === "Enter") {
    event.preventDefault();
  }
});
