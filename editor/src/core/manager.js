class Manager {
  constructor(data) {
    if (!data || !data.character || !data.battler || !data.face) {
      throw new Error("Se necesita un objeto inicial de datos válido.");
    }

    this.character = signal(data.character);
    this.battler = signal(data.character);
    this.face = signal(data.face);
  }
}
