// Import SCSS stylesheet
import "@/styles/index.scss";

type CardData = {
  face: string;
  suit: string;
  value: string;
};

type GameCardElement = HTMLDivElement & {
  readonly dataset: CardData;
};

let attempts: number = 0;

let cardSet: CardData[] | undefined;

const board: CardData[][] = [];
const rows: number = 2;
const columns: number = 3;

let card1stSelected: GameCardElement | null | undefined;
let card2ndSelected: GameCardElement | null | undefined;
let cardsMatched: number = 0;
const maxAttempts: number = 3;

function createDeck(): CardData[] {
  const suits: string[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const faces: string[] = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const deck: CardData[] = [];

  for (const suit of suits) {
    for (const face of faces) {
      const value: string = `${face} of ${suit}`;
      deck.push({ face, suit, value });
    }
  }
  return deck;
}

window.onload = function (): void {
  const fullDeck: CardData[] = createDeck();
  prepareCardSet(fullDeck);
  startGame();

  (document.getElementById("attempts") as HTMLElement).innerText =
    attempts.toString();
  document
    .getElementById("restart-button")
    ?.addEventListener("click", restartGame); // optional chaining
};

function prepareCardSet(deck: CardData[]): void {
  // Shuffle
  const shuffledFullDeck: CardData[] = shuffleArray(deck);

  // Get 3 unique cards
  const cardsToDuplicate: CardData[] = shuffledFullDeck.slice(0, 3);

  // Duplicate the 3 and add them to the set
  cardSet = cardsToDuplicate.concat(cardsToDuplicate);

  // Shuffle to make position random too
  cardSet = shuffleArray(cardSet);

  console.log("Final 6 cardSet for game:", cardSet);
}

function restartGame(): void {
  // reset
  attempts = 0;
  cardsMatched = 0;
  card1stSelected = null;
  card2ndSelected = null;

  (document.getElementById("attempts") as HTMLElement).innerText =
    attempts.toString();
  (document.getElementById("game-status") as HTMLElement).innerText = "";

  // new deck
  const fullDeck: CardData[] = createDeck();
  prepareCardSet(fullDeck);

  // Clear
  (document.getElementById("gameBoard") as HTMLElement).innerHTML = "";

  startGame();
}

/**helper Fisher-Yates shuffle **good ref**/

function shuffleArray<T>(array: T[]): T[] {
  let currentIndex: number = array.length;
  let randomIndex: number;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap it with the current element
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function startGame(): void {
  (document.getElementById("gameBoard") as HTMLElement).innerHTML = "";

  board.length = 0;
  if (!cardSet) return;

  for (let r = 0; r < rows; r++) {
    const row: CardData[] = [];
    for (let c = 0; c < columns; c++) {
      const cardData: CardData = cardSet.pop()!;
      row.push(cardData);

      const card = document.createElement("div") as GameCardElement;
      card.id = r.toString() + "-" + c.toString();
      card.classList.add("card", "card-back");

      card.dataset.face = cardData.face;
      card.dataset.suit = cardData.suit;
      card.dataset.value = cardData.value;

      card.addEventListener("click", selectCard);
      (document.getElementById("gameBoard") as HTMLElement).append(card);
    }
    board.push(row);
  }
}

function selectCard(this: GameCardElement): void {
  // Prevent further clicks when cards flipping back or game is over
  if ((card1stSelected && card2ndSelected) || attempts >= maxAttempts) {
    return;
  }

  // Only unrevealed cards clickable
  if (this.classList.contains("card-back")) {
    if (!card1stSelected) {
      card1stSelected = this;
      revealCard(card1stSelected);
    } else if (!card2ndSelected && this !== card1stSelected) {
      card2ndSelected = this;
      revealCard(card2ndSelected);

      // delay for update
      setTimeout(update, 1000);
    }
  }
}

function revealCard(cardElement: GameCardElement): void {
  cardElement.classList.remove("card-back");
  cardElement.classList.add("card-revealed");
  cardElement.innerText = `${cardElement.dataset.face}\n${cardElement.dataset.suit}`;

  if (
    cardElement.dataset.suit === "Hearts" ||
    cardElement.dataset.suit === "Diamonds"
  ) {
    cardElement.classList.add("card-red");
  }
}

function hideCard(cardElement: GameCardElement): void {
  cardElement.classList.add("card-back");
  cardElement.classList.remove("card-revealed");
  cardElement.classList.remove("card-red");
  // clear text when hidden
  cardElement.innerText = "";
}

function update(): void {
  const first = card1stSelected!;
  const second = card2ndSelected!;

  // Compare cards
  if (first.dataset.value !== second.dataset.value) {
    hideCard(first);
    hideCard(second);
    attempts += 1;
    (document.getElementById("attempts") as HTMLElement).innerText =
      attempts.toString();
  } else {
    // if match keep revealed, remove event listeners
    first.removeEventListener("click", selectCard);
    second.removeEventListener("click", selectCard);

    cardsMatched += 2;
  }

  // Check win/loss condition
  if (cardsMatched === rows * columns) {
    endGame("Congratulations! You won");
  } else if (attempts >= maxAttempts) {
    endGame("Sorry, you lost");
  }

  // Reset selected cards for the next turn
  card1stSelected = null;
  card2ndSelected = null;
}

function endGame(message: string): void {
  (
    document.getElementById("game-status") as HTMLElement
  ).innerText = `${message}!`;
  // card click disabled when lose
  const remainingCards: NodeListOf<GameCardElement> =
    document.querySelectorAll(".card");
  remainingCards.forEach((card) => {
    card.removeEventListener("click", selectCard);
  });
}
