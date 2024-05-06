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

export const royalFlush = 'royal-flush'
export const straightFlush = 'straight-flush'
export const fourOfKind = 'four-of-kind'
export const fullHouse = 'full-house'
export const flush = 'flush'
export const straight = 'straight'
export const threeOfKind = 'three-of-kind'
export const twoPair = 'two-pair'
export const hiPair = 'hi-pair'
export const loPair = 'lo-pair'
export const hiCard = 'hi-card'

export const pokerValue = {
    'royal-flush': 800,
    'straight-flush': 50,
    'four-of-kind': 25,
    'full-house': 9,
    'flush': 6,
    'straight': 4,
    'three-of-kind': 3,
    'two-pair': 2,
    'hi-pair': 1,
    'lo-pair': 0,
    'hi-card': 0
}

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

export const pullCard = (deck, cardRank) => {
    const index = deck.pile.findIndex((card) => card[0] === cardRank)
    if (index >= 0) {
        const [card] = deck.pile.splice(index, 1)
        deck.discarded.push(card)
        return card
    }

    const dIndex = deck.discarded.findIndex((card) => card[0] === cardRank)
    if (dIndex >= 0) {
        return deck.discarded[dIndex]
    }

    throw 'Did not find card'
}

const cardOrder = [ace, king, queen, jack, ten, nine, eight, seven, six, five, four, three, two]

export const evaluatePokerHand = (hand) => {
    const rankDict = {
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': [],
        'T': [],
        'J': [],
        'Q': [],
        'K': [],
        'A': []
    }

    const suitDict = {
        '♠': [],
        '♥': [],
        '♦': [],
        '♣': []
    }

    hand.forEach((card) => {
        rankDict[card[0]].push(card)
        suitDict[card[1]].push(card)
    })

    let result = hiCard
    let numPairs = 0
    let numTrips = 0
    let numFours = 0
    let straightCards = 0
    for (let count = 0; count < cardOrder.length; count++) {
        const numCards = rankDict[cardOrder[count]].length

        if (numCards === 0 && straightCards !== 5) {
            straightCards = 0
        } else if (numCards === 1) {
            straightCards++
        } else if (numCards === 2) {
            numPairs++
        } else if (numCards === 3) {
            numTrips++
        } else if (numCards === 4) {
            numFours++
        }
    }

    if (straightCards === 4 && rankDict['A'].length === 1) {
        straightCards++
    }

    let isFlushed = false
    for (let i = 0; i < suits.length; i++) {
        if (suitDict[suits[i]].length === 5) {
            isFlushed = true
        }
    }

    if (straightCards === 5) {
        result = isFlushed ? straightFlush : straight
        if (result === straightFlush && rankDict['A'].length && rankDict['K'].length) {
            result = royalFlush
        }
    } else if (numFours === 1) {
        result = fourOfKind
    } else if (numTrips === 1 && numPairs === 1) {
        result = fullHouse
    } else if (isFlushed) {
        result = flush
    } else if (numTrips === 1) {
        result = threeOfKind
    } else if (numPairs === 2) {
        result = twoPair
    } else if (numPairs === 1) {
        if (rankDict['A'].length === 2 ||
            rankDict['K'].length === 2 ||
            rankDict['Q'].length === 2 ||
            rankDict['J'].length === 2) {
            result = hiPair
        } else {
            result = loPair
        }
    }

    return result
}
