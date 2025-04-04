/**
 * @singleton Batcher
 *
 * @description
 * Batcher es un objeto singleton que permite agrupar la ejecución de efectos
 * (funciones) para ser ejecutados de forma diferida, una vez finalizada la operación
 * principal. Esto es útil para optimizar el rendimiento y evitar ejecuciones repetidas.
 */
const Batcher = (() => {
  let batching = false;
  let pendingEffects = new Set();

  // Ejecuta una función dentro de un batch y luego ejecuta los efectos acumulados
  function run(fn) {
    batching = true;
    fn();
    batching = false;
    // Programamos la ejecución de los efectos en una microtarea
    Promise.resolve().then(() => {
      pendingEffects.forEach((effect) => effect());
      pendingEffects.clear();
    });
  }

  // Registra un efecto: si estamos en batching, lo acumula; de lo contrario, lo ejecuta inmediatamente
  function scheduleEffect(effect) {
    if (batching) {
      pendingEffects.add(effect);
    } else {
      effect();
    }
  }

  // Método para conocer el estado actual del batching
  function isBatching() {
    return batching;
  }

  return { run, scheduleEffect, isBatching };
})();

/**
 * @function html
 *
 * @description
 * Crea un fragmento de HTML a partir de un template string, permitiendo la inserción de valores dinámicos.
 * Esto evita ataques XSS al usar `innerHTML` directamente.
 */
function html(strings, ...values) {
  const template = document.createElement("template");
  template.innerHTML = strings.reduce((acc, str, i) => {
    let value = values[i] ?? "";
    return acc + str + value;
  }, "");
  return template.content.cloneNode(true);
}

/**
 * @function attachEvents
 *
 * @description
 * Vincula eventos personalizados a elementos dentro de un nodo dado.
 * Busca atributos que comiencen con "@" (como "@click" o "@input") y los convierte
 * en event listeners, enlazando las funciones correspondientes del componente.
 * Luego, elimina los atributos para evitar que queden en el DOM.
 */
function attachEvents(node, component) {
  const cleanupFunctions = [];

  node.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      if (attr.name.startsWith("@")) {
        const eventName = attr.name.slice(1);
        // Verifica que el método exista en el componente
        if (typeof component[attr.value] !== "function") {
          console.warn(`El método ${attr.value} no está definido en el componente.`);
          return;
        }
        const handler = component[attr.value].bind(component);
        el.addEventListener(eventName, handler);
        // Registra la función para remover el event listener
        cleanupFunctions.push(() => el.removeEventListener(eventName, handler));
        // Elimina el atributo para limpiar el DOM
        el.removeAttribute(attr.name);
      }
    });
  });

  return cleanupFunctions;
}

/**
 * @class Signal
 * @extends EventTarget
 *
 * @description
 * La clase `Signal` es una implementación simple de una señal reactiva que permite
 * almacenar un valor y ejecutar efectos (funciones) automáticamente cuando el valor cambia.
 */
class Signal extends EventTarget {
  #value;
  #effects = new Set();

  constructor(initialValue) {
    super();
    this.#value = initialValue;
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    if (this.#value === newValue) return;
    const oldValue = this.#value;
    this.#value = newValue;
    this.dispatchEvent(new CustomEvent("change", { detail: { oldValue, newValue } }));
    for (const effect of this.#effects) {
      Batcher.scheduleEffect(() => effect(newValue));
    }
  }

  onChange(effect) {
    effect(this.#value);
    this.#effects.add(effect);
    return () => this.#effects.delete(effect);
  }

  unsubscribe(effect) {
    if (effect) {
      this.#effects.delete(effect);
    } else {
      this.#effects.clear();
    }
  }
}

const signal = (value) => new Signal(value);

const UI = {
  screen: signal("character"),
  project: signal(null),
  loading: signal(false),
};

/**
 * @class Component
 * @extends HTMLElement
 *
 * @description
 * Clase base para definir componentes personalizados en la aplicación.
 * Extiende `HTMLElement` para permitir la creación de Web Components.
 * Proporciona un sistema de estado reactivo basado en `Signal`.
 */
class Component extends HTMLElement {
  #cleanup = [];

  constructor() {
    super();
    this.rendered = false;
    this.signal = {};
  }

  /**
   * @method setSignal
   * @param {Object<string, any>} newState - Un objeto con claves y valores que representan el nuevo estado del componente.
   *
   * @description
   * Establece o actualiza valores en el estado del componente.
   * Si una clave ya existe y es una `Signal`, simplemente actualiza su valor.
   * Si la clave no existe, se crea una nueva `Signal` asociada a ese valor.
   */
  setSignal(newState) {
    Object.entries(newState).forEach(([key, value]) => {
      if (!(this.signal[key] instanceof Signal)) {
        this.signal[key] = signal(value);
      } else {
        this.signal[key].value = value;
      }
    });
  }

  connectedCallback() {
    if (!this.rendered) {
      this.rendered = true;
      const template = this.render();
      this.replaceChildren(template);
      // Registra los cleanups devueltos por attachEvents
      const eventCleanups = attachEvents(this, this);
      this.#cleanup.push(...eventCleanups);
      this.onLoad();
      this.effects();
    }
  }

  disconnectedCallback() {
    this.#cleanup.forEach((fn) => fn());
    this.#cleanup = [];
    this.onUnload();
  }

  // Método para registrar funciones de limpieza adicionales
  register(fn) {
    if (typeof fn === "function") {
      this.#cleanup.push(fn);
    }
  }

  onLoad() {}

  onUnload() {}

  effects() {}

  render() {
    throw new Error("Debes definir render() en tu componente.");
  }
}
