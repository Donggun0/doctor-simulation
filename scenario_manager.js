class ScenarioManager {
    constructor() {
        this.deck = [...scenarios];
        this.currentScenario = null;
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    drawNext() {
        if (this.deck.length === 0) {
            return null;
        }
        this.currentScenario = this.deck.pop();
        return this.currentScenario;
    }

    // Future feature: Filter by stage or difficulty
    filterByStage(stageLevel) {
        // Implement if stage progression is added
    }
}
