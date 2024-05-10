const spade = 'S'
const heart = 'H'
const diamond = 'D'
const club = 'C'

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

export const blackjackValue = {
  'A': 11,
  'K': 10,
  'Q': 10,
  'J': 10,
  'T': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
}

export const cardCountValue = {
  'A': -1,
  'K': -1,
  'Q': -1,
  'J': -1,
  'T': -1,
  '9': 0,
  '8': 0,
  '7': 0,
  '6': 1,
  '5': 1,
  '4': 1,
  '3': 1,
  '2': 1
}

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
  deck.discarded = deck.discarded.concat(deck.pile)

  for (let i = deck.discarded.length - 1; i > 0; i--) {
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

export const removeCard = (cardString, deck) => {
  if (cardString.length === 1) {
    deck.pile = deck.pile.filter((card) => card[0] !== cardString)
    deck.discarded = deck.discarded.filter((card) => card[0] !== cardString)
  } else if (cardString.length === 2) {
    deck.pile = deck.pile.filter((card) => card !== cardString)
    deck.discarded = deck.discarded.filter((card) => card !== cardString)
  }
}

export const addCard = (card, deck) => {
  deck.discarded.push(card)
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
    'S': [],
    'H': [],
    'D': [],
    'C': []
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

  if (straightCards === 4 && rankDict.A.length === 1) {
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
    if (result === straightFlush && rankDict.A.length && rankDict.K.length) {
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
    if (rankDict.A.length === 2 ||
            rankDict.K.length === 2 ||
            rankDict.Q.length === 2 ||
            rankDict.J.length === 2) {
      result = hiPair
    } else {
      result = loPair
    }
  }

  return result
}

export const checkPokerHolds = (hand, result, strategy) => {
  // 'jacks' strategy, or on the hi-card part of 'smart' strategy
  if ((result === 'hi-card' && strategy === 'smart') || strategy === 'jacks') {
    return hand.map(card => warCardValue[card[0]] >= 9)
  } else if (
    (strategy === 'pairs' || strategy === 'smart') &&
        (result === 'hi-pair' || result === 'lo-pair' || result === 'three-of-kind' || result === 'two-pair')
  ) {
    const dict = {}
    const foundItems = []
    for (let i = 0; i < 5; i++) {
      if (dict[hand[i][0]]) {
        foundItems.push(hand[i][0])
      }
      dict[hand[i][0]] = true
    }

    return hand.map(card => foundItems.includes(card[0]))
  } else if (strategy === 'flush') {
    const dict = {
      S: 0,
      H: 0,
      D: 0,
      C: 0
    }

    for (let i = 0; i < 5; i++) {
      dict[hand[i][1]]++
    }

    let max = 0
    let maxSuit = 0
    for (let j = 0; j < 4; j++) {
      if (dict[suits[j]] > max) {
        max = dict[suits[j]]
        maxSuit = suits[j]
      }
    }

    return hand.map(card => card[1] === maxSuit)
  } else if (strategy === 'smart') {
    return [true, true, true, true, true]
  } else {
    return [false, false, false, false, false]
  }
}

// ATTN: wrong, two aces evals to 2 or 22 instead of 12
export const evaulateBjValues = (cards) => {
  // get high value of all cards
  let value = 0
  for (let i = 0; i < cards.length; i++) {
    value += blackjackValue[cards[i][0]]
  }

  // walk through cards again, we can subtract 10 for every ace that
  // makes value over 21, but always at least one to signal to user.
  let containsAce = false
  let lowValue = value
  for (let i = 0; i < cards.length; i++) {
    if (cards[i][0] === 'A') {
      if (value > 21 || !containsAce) {
        containsAce = true
        lowValue -= 10
      }
      if (lowValue <= 22) {
        break
      }
    }
  }

  // for display purposes
  if (value === lowValue && containsAce) {
    lowValue -= 10
  }

  return [lowValue, value]
}

export const evaulateFinalBjValues = (cards) => {
  const values = evaulateBjValues(cards)

  if (values[1] > 21) {
    return values[0]
  }

  return values[1]
}
