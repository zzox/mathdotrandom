import { drawCard, evaluatePokerHand, makeDeck, shuffleDeck } from '../card-deck.js'

const deck = makeDeck(1)
shuffleDeck(deck)

const resultsDict = {
  'royal-flush': [],
  'straight-flush': [],
  'four-of-kind': [],
  'full-house': [],
  'flush': [],
  'straight': [],
  'three-of-kind': [],
  'two-pair': [],
  'hi-pair': [],
  'lo-pair': [],
  'hi-card': []
}

for (let i = 0; i < 1000000; i++) {
  const hand = []
  for (let j = 0; j < 5; j++) {
    hand.push(drawCard(deck))
  }
  const result = evaluatePokerHand(hand)

  resultsDict[result].push(hand.join(' '))

  shuffleDeck(deck)
}

for (const key in resultsDict) {
  console.log(key, resultsDict[key].length)
}
console.log(resultsDict)
