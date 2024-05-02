const spade = '♠'
const heart = '♥'
const diamond = '♦'
const club = '♣'

const suits = [spade, heart, diamond, club]

const two = '2'
const three = '3'
const four = '4'
const five = '5'
const six = '6'
const seven = '7'
const eight = '8'
const nine = '9'
const ten = 'T'
const jack = 'J'
const queen = 'Q'
const king = 'K'
const ace = 'A'

const cards = [two, three, four, five, six, seven, eight, nine, ten, jack, queen, king, ace]

export const warCardValue = {
    '2': 0,
    '3': 1,
    '4': 2,
    '5': 3,
    '6': 4,
    '7': 5,
    '8': 6,
    '9': 7,
    'T': 8,
    'J': 9,
    'Q': 10,
    'K': 11,
    'A': 12
}

export const pokerValue = () => {}
export const blackjackValue = () => {}

export const makeDeck = (num = 1) => {
    const pile = []

    for (let i = 0; i < num; i++) {
        for (let s = 0; s < suits.length; s++) {
            for (let c = 0; c < cards.length; c++) {
                pile.push(cards[c] + suits[s])
            }
        }
    }

    return {
        discarded: [],
        pile
    }
}

// https://stackoverflow.com/a/12646864
export const shuffleDeck = (deck) => {
    deck.discarded = deck.discarded.concat(deck.pile);

    for (let i = 51; i > 0; i--) {
        const k = Math.floor(Math.random() * i + 1)
        ;[deck.discarded[i], deck.discarded[k]] = [deck.discarded[k], deck.discarded[i]]
    }

    deck.pile = deck.discarded
    deck.discarded = []
}

export const drawCard = (deck) => {
    if (!deck.pile.length) {
        shuffleDeck(deck)
    }

    const card = deck.pile.pop()
    deck.discarded.push(card)
    return card
}
