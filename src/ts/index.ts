// Imports your SCSS stylesheet
import "@/scss/main.scss";

interface Card {
  face: string;
  suit: string;
  value: string;
}

function createDeck(): Card[] {
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const faces = [
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
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const face of faces) {
      const value = `${face} of ${suit}`;
      deck.push({ face, suit, value });
    }
  }
  return deck;
}

console.log(deck);
