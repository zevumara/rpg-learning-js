class LoadingComponent extends Component {
  constructor() {
    super();
  }

  effects() {
    this.register(
      UI.loading.onChange((value) => {
        const overlay = this.querySelector(".overlay");
        if (value) {
          overlay.classList.add("visible");
        } else {
          overlay.classList.remove("visible");
        }
      })
    );
  }

  render() {
    return html`
      <div class="overlay">
        <div class="spinner"></div>
      </div>
    `;
  }
}

customElements.define("loading-component", LoadingComponent);
