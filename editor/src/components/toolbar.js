class ToolbarComponent extends Component {
  constructor() {
    super();
  }

  save() {
    // Exporta los datos de UI.project.value
  }

  export() {
    // Lee UI.editing.value para saber que tiene seleccionado
    // Usa la información de lo seleccionado de UI.project.value
    // En base a esa información, crea un container en pixi con todas las capas y la exporta a png
  }

  render() {
    return html`
      <div id="toolbar">
        <ul class="primary">
          <li>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="none"
                d="M17.58 9.71a6 6 0 0 0-7.16 3.58m7.16-3.58A6 6 0 1 1 12 19.972M17.58 9.71a6 6 0 1 0-11.16 0m4 3.58A6 6 0 0 0 10 15.5c0 1.777.773 3.374 2 4.472m-1.58-6.682a6.01 6.01 0 0 1-4-3.58m0 0A6 6 0 1 0 12 19.972"
              />
            </svg>
            Colors
          </li>
          <li>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path
                  d="M8 22v-3c0-1.886 0-2.828.586-3.414S10.114 15 12 15s2.828 0 3.414.586S16 17.114 16 19v3M10 7h4"
                />
                <path
                  d="M3 11.858c0-4.576 0-6.864 1.387-8.314a5 5 0 0 1 .157-.157C5.994 2 8.282 2 12.858 2c1.085 0 1.608.004 2.105.19c.479.178.88.512 1.682 1.181l2.196 1.83c1.062.885 1.592 1.327 1.876 1.932C21 7.737 21 8.428 21 9.81V13c0 3.75 0 5.625-.955 6.939a5 5 0 0 1-1.106 1.106C17.625 22 15.749 22 12 22s-5.625 0-6.939-.955a5 5 0 0 1-1.106-1.106C3 18.625 3 16.749 3 13z"
                />
              </g>
            </svg>
            Save
          </li>
          <li>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path
                  d="M18.5 16c.506.491 2.5 1.8 2.5 2.5M18.5 21c.506-.491 2.5-1.8 2.5-2.5m0 0h-8M11 22h-.273c-3.26 0-4.892 0-6.024-.798a4.1 4.1 0 0 1-.855-.805C3 19.331 3 17.797 3 14.727v-2.545c0-2.963 0-4.445.469-5.628c.754-1.903 2.348-3.403 4.37-4.113C9.095 2 10.668 2 13.818 2c1.798 0 2.698 0 3.416.252c1.155.406 2.066 1.263 2.497 2.35C20 5.278 20 6.125 20 7.818V13"
                />
                <path
                  d="M3 12a3.333 3.333 0 0 1 3.333-3.333c.666 0 1.451.116 2.098-.057A1.67 1.67 0 0 0 9.61 7.43c.173-.647.057-1.432.057-2.098A3.333 3.333 0 0 1 13 2"
                />
              </g>
            </svg>
            Export
          </li>
        </ul>
        <ul class="secondary">
          <li>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                color="currentColor"
                d="M14.992 7.549H4.142c.42-.46 1.17-1.02 2.16-1.77l1.15-.88a.749.749 0 1 0-.91-1.19l-1.15.88c-2.03 1.54-3.15 2.38-3.15 3.72s1.12 2.18 3.14 3.72l1.15.88c.14.1.3.15.46.15c.23 0 .45-.1.6-.29c.25-.33.19-.8-.14-1.05l-1.15-.88c-.99-.75-1.73-1.31-2.15-1.77h10.85c2.89 0 5.25 2.35 5.25 5.25s-2.36 5.25-5.25 5.25h-4c-.41 0-.75.34-.75.75s.34.75.75.75h4c3.72 0 6.75-3.03 6.75-6.75s-3.03-6.75-6.75-6.75z"
              />
            </svg>
            Undo
          </li>
          <li>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path d="M21 8.332H9a6 6 0 1 0 0 12h4" />
                <path
                  d="m17 4.332l1.154.877C20.05 6.65 21 7.37 21 8.332s-.949 1.682-2.846 3.124L17 12.332"
                />
              </g>
            </svg>
            Redo
          </li>
        </ul>
      </div>
    `;
  }
}

customElements.define("toolbar-component", ToolbarComponent);
