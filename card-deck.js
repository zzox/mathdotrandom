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
    two: 0,
    three: 1,
    four: 2,
    five: 3,
    six: 4,
    seven: 5,
    eight: 6,
    nine: 7,
    ten: 8,
    jack: 9,
    queen: 10,
    king: 11,
    ace: 12
}

export const makeDeck = () => {
    const pile = []

    for (let s = 0; s < suits.length; s++) {
        for (let c = 0; c < cards.length; c++) {
            pile.push(cards[c] + suits[s])
        }
    }
    
    return {
        discarded: [],
        pile
    }
}

// https://stackoverflow.com/a/12646864
export const shuffleDeck = (deck) => {
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
