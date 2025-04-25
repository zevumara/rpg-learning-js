class SidebarComponent extends Component {
  constructor() {
    super();
    this.setSignal({
      expanded: false,
      files: [],
    });
  }

  onLoad() {
    this.querySelector("aside").classList.toggle("expanded", this.signal.expanded.value);

    this.querySelector("#files").addEventListener("click", (event) => {
      const li = event.target.closest("li");
      if (li.dataset.file) this.selectFile(li);
    });

    this.querySelector("input#file").addEventListener("change", async (event) => {
      try {
        const project = await readFile(event.target.files[0]);
        console.log(project);
      } catch (error) {
        console.error("Error leyendo o parseando el archivo:", error);
      }
    });
  }

  toggleSidebar() {
    this.signal.expanded.value = !this.signal.expanded.value;
  }

  openFile() {
    this.querySelector("#file").click();
  }

  openFolder() {
    const files = [
      "character_nameaaaaaaaaaaaaaassassadadsaaaaaaaaaaaaaaa",
      "ESTO ES UNA PRUEBA",
      "nombre del personaje",
      "another_character_name",
      "character_name",
      "ESTO ES UNA PRUEBA",
      "nombre del personaje",
      "another_character_name",
      "character_name",
      "ESTO ES UNA PRUEBA",
      "nombre del personaje",
      "another_character_name",
      "character_name",
      "ESTO ES UNA PRUEBA",
      "nombre del personaje",
      "another_character_name",
    ];
    const numElements = Math.floor(Math.random() * files.length) + 1;
    const shuffled = files.sort(() => Math.random() - 0.5);
    this.signal.files.value = shuffled.slice(0, numElements);
  }

  filterFiles() {
    const filterText = this.querySelector("#filter").value.toLowerCase();
    const items = this.querySelectorAll("#files li");

    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const isVisible = text.includes(filterText);
      item.style.display = isVisible ? "" : "none";
    });
  }

  selectFile(el) {
    const fileName = el.dataset.file;
    UI.project.value = fileName;
    this.querySelectorAll("#files li").forEach((li) => li.classList.remove("selected"));
    el.classList.add("selected");
    UI.loading.value = true;
    setTimeout(() => (UI.loading.value = false), 250);
  }

  effects() {
    this.register(
      this.signal.expanded.onChange((value) => {
        Batcher.run(() => {
          if (value) {
            this.querySelector("aside").classList.add("expanded");
          } else {
            this.querySelector("aside").classList.remove("expanded");
          }
        });
      })
    );

    this.register(
      this.signal.files.onChange((files) => {
        Batcher.run(() => {
          UI.loading.value = true;
          setTimeout(() => {
            const ul = this.querySelector("#files");
            ul.innerHTML = files.map((file) => `<li data-file="${file}">${file}</li>`).join("");
            UI.loading.value = false;
          }, 250);
        });
      })
    );
  }

  render() {
    return html`
      <aside>
        <button id="close" @click="toggleSidebar" type="button" title="Cerrar">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 5L5 19M5 5l14 14"
              color="currentColor"
            />
          </svg>
        </button>
        <ul>
          <li class="item" @click="toggleSidebar">
            <svg width="24" height="24">
              <path
                fill="none"
                d="M2.36 14.597c-.375-2.072-.563-3.108-.03-3.81q.054-.07.114-.135C3.037 10 4.087 10 6.186 10h11.628c2.1 0 3.15 0 3.742.652q.06.065.113.136c.534.701.346 1.737-.03 3.809c-.54 2.978-.81 4.467-1.828 5.382q-.104.095-.215.18c-1.08.841-2.59.841-5.608.841h-3.976c-3.019 0-4.528 0-5.608-.841a4 4 0 0 1-.215-.18c-1.018-.915-1.288-2.404-1.828-5.382M8.02 5.111h7.787c1.309 0 2.949-.188 3.79 1.037C20 6.737 20 8.361 20 10m-7.987-4.889l-.763-1.487c-.268-.522-.519-1.154-1.067-1.44C9.83 2 9.403 2 8.551 2c-2 0-3 0-3.668.545c-1.117.913-.857 2.785-.857 4.056V10"
              />
            </svg>
            <span>Files</span>
          </li>
          <li class="folder">
            <button class="primary disabled">New Character</button>
            <button class="primary" @click="openFile">Load Character</button>
            <button class="primary" @click="openFolder">Open Folder...</button>
            <input type="file" id="file" accept=".rrcd" style="display: none;" />
            <div class="search">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="none" d="M17.5 17.5L22 22m-2-11a9 9 0 1 0-18 0a9 9 0 0 0 18 0" />
              </svg>
              <input id="filter" type="text" @input="filterFiles" />
            </div>
            <ul id="files">
              ${this.signal.files.value
                .map((file) => `<li data-file="${file}" @click="selectFile">${file}</li>`)
                .join("")}
            </ul>
          </li>
          <li class="item">
            <svg width="24" height="24">
              <g fill="none">
                <path
                  d="m21.318 7.141l-.494-.856c-.373-.648-.56-.972-.878-1.101c-.317-.13-.676-.027-1.395.176l-1.22.344c-.459.106-.94.046-1.358-.17l-.337-.194a2 2 0 0 1-.788-.967l-.334-.998c-.22-.66-.33-.99-.591-1.178c-.261-.19-.609-.19-1.303-.19h-1.115c-.694 0-1.041 0-1.303.19c-.261.188-.37.518-.59 1.178l-.334.998a2 2 0 0 1-.789.967l-.337.195c-.418.215-.9.275-1.358.17l-1.22-.345c-.719-.203-1.078-.305-1.395-.176c-.318.129-.505.453-.878 1.1l-.493.857c-.35.608-.525.911-.491 1.234c.034.324.268.584.736 1.105l1.031 1.153c.252.319.431.875.431 1.375s-.179 1.056-.43 1.375l-1.032 1.152c-.468.521-.702.782-.736 1.105s.14.627.49 1.234l.494.857c.373.647.56.971.878 1.1s.676.028 1.395-.176l1.22-.344a2 2 0 0 1 1.359.17l.336.194c.36.23.636.57.788.968l.334.997c.22.66.33.99.591 1.18c.262.188.609.188 1.303.188h1.115c.694 0 1.042 0 1.303-.189s.371-.519.59-1.179l.335-.997c.152-.399.428-.738.788-.968l.336-.194c.42-.215.9-.276 1.36-.17l1.22.344c.718.204 1.077.306 1.394.177c.318-.13.505-.454.878-1.101l.493-.857c.35-.607.525-.91.491-1.234s-.268-.584-.736-1.105l-1.031-1.152c-.252-.32-.431-.875-.431-1.375s.179-1.056.43-1.375l1.032-1.153c.468-.52.702-.781.736-1.105s-.14-.626-.49-1.234"
                />
                <path d="M15.52 12a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0" />
              </g>
            </svg>
            <span>Settings</span>
          </li>
        </ul>
      </aside>
    `;
  }
}

customElements.define("sidebar-component", SidebarComponent);
