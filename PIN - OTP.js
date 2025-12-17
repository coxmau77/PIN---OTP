/* ========================================================= */
/* CONFIGURACIÓN GENERAL                                     */
/* ========================================================= */

/*
  En producción, este código vendría desde backend
  o sesión activa del usuario
*/
const VALID_CODE = "123456";
const CODE_LENGTH = 6;

/* ========================================================= */
/* ELEMENTOS DEL DOM                                         */
/* ========================================================= */

const input = document.getElementById("code");
const dots = document.querySelectorAll(".code-visual span");
const keys = document.querySelectorAll(".keypad button");
const status = document.getElementById("code-status");

/* ========================================================= */
/* RENDER VISUAL                                             */
/* ========================================================= */

/**
 * Actualiza los indicadores visuales del código
 * @param {string} value - valor actual del input
 * @param {"default" | "error"} state
 */
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

/**
 * Muestra mensajes de estado al usuario
 */
function updateStatus(message = "", tone = "neutral") {
  status.textContent = message;

  status.style.color =
    tone === "error"
      ? "var(--danger-clr)"
      : "oklch(from var(--on-surface) l c h / 0.65)";

  status.dataset.visible = message ? "true" : "false";
}

/* ========================================================= */
/* VALIDACIÓN (FUNCIÓN PURA)                                 */
/* ========================================================= */

function validateCode(value, reference) {
  return value === reference;
}

/* ========================================================= */
/* RESPUESTAS DE ESTADO                                      */
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

/**
 * ÚNICO orquestador del flujo:
 * - render
 * - validación
 * - feedback
 */
function handleInputChange() {
  // Mientras el código no esté completo
  if (input.value.length < CODE_LENGTH) {
    updateStatus();
    updateDots(input.value);
    return;
  }

  // Validación final
  const isValid = validateCode(input.value, VALID_CODE);
  isValid ? handleSuccess() : handleError();
}

/* ========================================================= */
/* UTILIDADES                                                */
/* ========================================================= */

function clearInput() {
  input.value = "";
  updateDots("");
  updateStatus();
}

/* ========================================================= */
/* KEYPAD (BOTONES)                                         */
/* ========================================================= */

keys.forEach((btn) => {
  btn.addEventListener("click", () => {
    const { key, action } = btn.dataset;

    switch (action) {
      case "delete":
        input.value = input.value.slice(0, -1);
        handleInputChange();
        return;

      case "clear":
        clearInput();
        return;
    }

    // Agregar dígito
    if (key && input.value.length < CODE_LENGTH) {
      input.value += key;
      handleInputChange();
    }
  });
});

/* ========================================================= */
/* TECLADO FÍSICO                                            */
/* ========================================================= */

document.addEventListener("keydown", (event) => {
  const { key } = event;

  // Números
  if (/^\d$/.test(key) && input.value.length < CODE_LENGTH) {
    input.value += key;
    handleInputChange();
    return;
  }

  // Borrar
  if (key === "Backspace" || key === "Delete") {
    input.value = input.value.slice(0, -1);
    handleInputChange();
    return;
  }

  // Evitar submits accidentales
  if (key === "Enter") {
    event.preventDefault();
  }
});
