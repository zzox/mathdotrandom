import { makeDeck, shuffleDeck, drawCard, evaluatePokerHand, hiCard, pokerValue, loPair, warCardValue, checkPokerHolds, removeCard, addCard } from '../card-deck.js'
import { $id, suitToHtml, formatRate, formatPrice, $create } from '../ui.js'
import State from '../state.js'

let unlocked = true

let pokerBet
let betAmount = 1
let maxBet = 1000
let pokerState = 'ready' // or, 'draw'
let cards = []
const cardHolds = [false, false, false, false, false]

// let resultShowTimer = 0
// const resultShowTime = 10000

let pokerGuessOn = false
let pokerGuessTimer = 0
let pokerGuessTime = 1000
let pokerGuessStrategy = 'jacks'

let loPairOn = false

let deck

let dealPokerButton, drawPokerButton

const pokerHoldButtons = []

export const pokerDisplayText = {
  'royal-flush': [' ROYAL', ' FLUSH!'],
  'straight-flush': ['STRAIGHT', ' FLUSH'],
  'four-of-kind': ['Four of', 'a kind'],
  'full-house': [' Full', ' House'],
  'flush': [' Flush', ' '],
  'straight': ['Straight', ''],
  'three-of-kind': ['Three of', 'a kind'],
  'two-pair': ['Two pair', ' '],
  'hi-pair': ['Hi-Pair', ' '],
  'lo-pair': ['Lo-Pair', ' '],
  'hi-card': [' ', ' ']
}

export const createPoker = () => {
  dealPokerButton = $id('poker-button-deal')
  dealPokerButton.onclick = () => {
    pokerDeal()
  }

  drawPokerButton = $id('poker-button-draw')
  drawPokerButton.onclick = () => {
    pokerDraw()
  }

  pokerBet = $id('poker-bet')

  pokerBet.onchange = (event) => {
    betAmount = parseInt(event.target.value > State.dollars ? State.dollars : event.target.value)
    if (!betAmount) {
      betAmount = 1
    }
  }

  for (let i = 0; i < 5; i++) {
    const holdItem = $id(`poker-hold-${i}`)
    holdItem.onchange = (event) => {
      cardHolds[i] = event.target.checked
    }
    pokerHoldButtons.push(holdItem)
  }

  $id('poker-auto-guess-box').onchange = (event) => {
    pokerGuessOn = event.target.checked
  }

  $id('poker-auto-choices').onchange = (event) => {
    pokerGuessStrategy = event.target.value
  }

  deck = makeDeck()
  shuffleDeck(deck)
}

const updatePokerUi = (card, num, isDraw) => {
  $id(`${isDraw ? 'draw' : 'deal'}-card-number-${num}`).innerText = card[0]
  $id(`${isDraw ? 'draw' : 'deal'}-card-suit-${num}`).innerHTML = suitToHtml[card[1]]
}

const lockPokerBetUi = () => {
  dealPokerButton.disabled = true
  drawPokerButton.disabled = false

  for (let i = 0; i < 5; i++) {
    $id(`poker-hold-${i}`).disabled = false
  }

  pokerBet.disabled = true
}

const unlockPokerBetUi = () => {
  dealPokerButton.disabled = false
  drawPokerButton.disabled = true

  for (let i = 0; i < 5; i++) {
    $id(`poker-hold-${i}`).disabled = true
  }

  pokerBet.disabled = false
}

const showPokerResultUi = (result, isDraw) => {
  $id(`${isDraw ? 'draw' : 'deal'}-result-line-0`).innerText = pokerDisplayText[result][0]
  $id(`${isDraw ? 'draw' : 'deal'}-result-line-1`).innerText = pokerDisplayText[result][1]
}

const resetPokerUi = () => {
  for (let i = 0; i < 5; i++) {
    const hold = pokerHoldButtons[i]
    hold.checked = false
    hold.disabled = true
    cardHolds[i] = false
    $id(`deal-card-number-${i}`).innerText = ' '
    $id(`deal-card-suit-${i}`).innerText = ' '
    $id(`draw-card-number-${i}`).innerText = ' '
    $id(`draw-card-suit-${i}`).innerText = ' '
  }
  // hack
  showPokerResultUi(hiCard, true)
  showPokerResultUi(hiCard, false)
  cards = []
  drawPokerButton.disabled = true
}

const pokerDeal = (isAuto = false) => {
  if (!unlocked) {
    throw 'Locked'
  }

  if (pokerState !== 'ready') {
    throw 'Cannot deal'
  }

  // TODO: if auto, skip the ui updates as both steps happen at once
  resetPokerUi()
  lockPokerBetUi()

  shuffleDeck(deck)

  State.checkIsBroke()

  for (let card = 0; card < 5; card++) {
    cards.push(drawCard(deck))
  }
  cards.forEach((card, i) => updatePokerUi(card, i, false))

  pokerState = 'draw'
  const result = evaluatePokerHand(cards)
  showPokerResultUi(result, false)

  if (isAuto) {
    const suggestion = checkPokerHolds(cards, result, pokerGuessStrategy)
    suggestion.forEach((item, i) => {
      cardHolds[i] = item
      pokerHoldButtons[i].checked = item
    })
  }

  State.subtractScore(betAmount)
}

const pokerDraw = (isAuto = false) => {
  if (pokerState !== 'draw') {
    throw 'Cannot draw'
  }

  for (let card = 0; card < 5; card++) {
    if (!cardHolds[card]) {
      cards[card] = drawCard(deck)
    }
  }
  cards.forEach((card, i) => updatePokerUi(card, i, true))

  unlockPokerBetUi()

  pokerState = 'ready'

  const result = evaluatePokerHand(cards)
  showPokerResultUi(result, true)

  cards.sort((a, b) => warCardValue[b[0]] - warCardValue[a[0]])

  const data = {
    handHtml: cards.map(card => card[0] + suitToHtml[card[1]]).join(''),
    wager: betAmount,
    game: 'poker',
    isAuto
  }

  if (result !== hiCard && (loPairOn || result !== loPair)) {
    State.updateScore(/* betAmount + */betAmount * pokerValue[result], data)
  } else {
    State.updateScore(0, data)
  }

  // give the user a second to see their hand when they play it themselves
  if (!isAuto && pokerGuessTimer > 0) {
    pokerGuessTimer -= 1000
  }
}

export const updatePoker = (delta) => {
  // TODO: see if its better to not hide games after results are shown,
  // seems to only make sense for coin-flip
  // resultShowTimer += delta
  // if (pokerState === 'ready' && resultShowTimer >= resultShowTime) {
  //     resetPokerUi()
  // }

  if (pokerGuessOn && pokerState === 'ready') {
    pokerGuessTimer += delta
    if (pokerGuessTimer >= pokerGuessTime) {
      pokerDeal(true)
      pokerDraw(true)
      pokerGuessTimer -= pokerGuessTime
    }
  }

  if (pokerBet.value > maxBet) {
    pokerBet.value = maxBet
  }

  if (pokerBet.value > State.dollars) {
    betAmount = State.dollars
    pokerBet.value = State.dollars

    // disable autoguess if too broke
    $id('poker-auto-guess-box').checked = false
    pokerGuessOn = false
    console.error('Cannot bet money you dont have')
  }
}

export const upgradeAutoPoker = (time) => {
  pokerGuessTime = time
  $id('poker-auto-guess').classList.remove('display-none')
  $id('poker-auto-guess-rate').innerText = ` ${formatRate(time)}`
}

export const upgradeMaxPokerBet = (newMax) => {
  maxBet = newMax
  $id('poker-max').innerText = `Max: ${formatPrice(newMax)}`
  $id('poker-bet').max = newMax
}

export const addPokerCard = (card) => {
  addCard(card, deck)
}

export const bitFlip = () => {
  removeCard('2', deck)
  addCard('TC', deck)
  addCard('TD', deck)
  addCard('TH', deck)
  addCard('TS', deck)
}

export const upgradeLoPair = () => {
  loPairOn = true
  // ATTN: feels gross
  pokerValue['lo-pair'] = 1
}

export const addPokerStrategy = (strategyName) => {
  const select = $id('poker-select')
  const option = $create('option')
  option.value = strategyName

  if (strategyName === 'pairs') {
    option.innerText = 'Keep Pairs'
  } else if (strategyName === 'flush') {
    option.innerText = 'Try Flush'
  } else if (strategyName === 'smart') {
    option.innerText = 'Smart'
  } else {
    console.error('bad strategy name')
  }

  select.appendChild(option)
}

export const unlockPoker = () => {
  unlocked = true
  $id('poker').classList.remove('display-none')
}
