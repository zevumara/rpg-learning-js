/**
 * @function batch
 *
 * @description
 * Controla la ejecución de múltiples efectos, agrupándolos en un solo ciclo.
 * Esto permite evitar que cada actualización dispare un re-renderizado o efecto
 * por separado, mejorando el rendimiento.
 */
let batching = false;
let pendingEffects = new Set();

function batch(fn) {
  batching = true;
  fn();
  batching = false;
  for (const effect of pendingEffects) {
    effect();
  }
  pendingEffects.clear();
}

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
      if (batching) {
        pendingEffects.add(effect);
      } else {
        effect(newValue);
      }
    }
  }

  onChange(effect) {
    effect(this.#value);
    this.#effects.add(effect);
    return () => effect;
  }

  unsuscribe(effect) {
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
  constructor() {
    super();
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
    this.render();
  }

  render() {
    throw new Error("Debes definir render() en tu componente.");
  }
}

class CounterComponent extends Component {
  constructor() {
    super();
    this.setSignal({ count: 0 });
  }

  render() {
    this.replaceChildren(html`
      <button id="decrement">-</button>
      <h1 id="count">${this.signal.count.value}</h1>
      <button id="increment">+</button>
    `);

    this.querySelector("#increment").addEventListener("click", () => this.signal.count.value++);
    this.querySelector("#decrement").addEventListener("click", () => this.signal.count.value--);

    this.signal.count.onChange((value) => {
      this.querySelector("#count").textContent = value;
    });
  }
}

customElements.define("counter-component", CounterComponent);

class SidebarComponent extends Component {
  constructor() {
    super();
    this.setSignal({ expanded: false });
  }

  render() {
    this.replaceChildren(html`
      <aside>
        <ul>
          <li>Open Folder</li>
          <li>Settings</li>
        </ul>
      </aside>
    `);

    this.signal.expanded.onChange((value) => {
      console.warn("Expanded:", value);
    });
  }
}

customElements.define("sidebar-component", SidebarComponent);
