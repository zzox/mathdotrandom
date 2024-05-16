import { makeDeck, shuffleDeck, drawCard, cardCountValue, evaulateBjValues, evaulateFinalBjValues, warCardValue } from '../card-deck.js'
import { $id, $create, $queryAll, formatRate, formatPrice, suitToHtml } from '../ui.js'
import State from '../state.js'

let unlocked = true
let bjState = 'ready'
let isBettingHiCount = false

let bjBet
let betAmount = 1
let maxBet = 1000
let bjCountMin = 0
let bjCountBetAmount = 0
let bjStrategy = 'hit16'
let bjSpy = false

let blackjackAmount = 1.5

let bjGuessOn = false
let bjGuessTimer = 0
let bjGuessTime = 1000

let deck
let dealerCards = []
let playerCards = []
let count = 0
let numDecks = 6

let dealBjButton, hitBjButton, standBjButton, bjCountMinUi, bjHiCountBet

export const createBj = () => {
  dealBjButton = $id('bj-button-deal')
  dealBjButton.onclick = () => {
    dealBj(false)
  }

  hitBjButton = $id('bj-button-hit')
  hitBjButton.onclick = () => {
    hitBj(false)
  }

  standBjButton = $id('bj-button-stand')
  standBjButton.onclick = () => {
    standBj(false)
  }

  bjBet = $id('bj-bet')
  bjBet.onchange = (event) => {
    betAmount = parseInt(event.target.value > State.dollars ? State.dollars : event.target.value)
    if (!betAmount) {
      betAmount = 1
    }
  }

  bjHiCountBet = $id('bj-hi-count')
  bjHiCountBet.onchange = (event) => {
    bjCountBetAmount = parseInt(event.target.value > State.dollars ? State.dollars : event.target.value)
    if (!bjCountBetAmount) {
      bjCountBetAmount = 0
    }
  }

  bjCountMinUi = $id('bj-count-min')
  bjCountMinUi.onchange = (event) => {
    bjCountMin = event.target.value
  }

  $id('bj-auto-guess-box').onchange = (event) => {
    bjGuessOn = event.target.checked
  }

  $id('bj-select').onchange = (event) => {
    bjStrategy = event.target.value
  }

  deck = makeDeck(6)
  shuffleDeck(deck)
}

const lockButtons = () => {
  dealBjButton.disabled = true
  hitBjButton.disabled = false
  standBjButton.disabled = false
  bjBet.disabled = true
  bjHiCountBet.disabled = true
  bjCountMinUi.disabled = true
  bjState = 'play'
}

// TODO: delete `it`
let it = 0

const unlockButtons = () => {
  dealBjButton.disabled = false
  hitBjButton.disabled = true
  standBjButton.disabled = true
  bjBet.disabled = false
  bjHiCountBet.disabled = false
  bjCountMinUi.disabled = false
  bjState = 'ready'

  it++

  if (deck.discarded.length > (deck.pile.length + deck.discarded.length) * 2 / 3) {
    console.log('shuffling', it, count, deck.discarded.length, deck.pile.length)
    count = 0
    shuffleDeck(deck)
    it = 0
  }
}

const updateDealerBjUi = (num, hide = false) => {
  if (num > 11) return

  $queryAll(`.bj-dealer-card-${num}`).forEach(item => item.classList.remove('display-none'))
  $id(`bj-dealer-number-${num}`).innerText = hide ? 'X' : dealerCards[num][0]
  $id(`bj-dealer-suit-${num}`).innerHTML = hide ? 'X' :  suitToHtml[dealerCards[num][1]]
}

const updatePlayerBjUi = (num) => {
  if (num > 11) return

  $queryAll(`.bj-player-card-${num}`).forEach(item => item.classList.remove('display-none'))
  $id(`bj-player-number-${num}`).innerText = playerCards[num][0]
  $id(`bj-player-suit-${num}`).innerHTML = suitToHtml[playerCards[num][1]]
}

const resetCardUi = () => {
  for (let i = 0; i < 11; i++) {
    $id(`bj-dealer-number-${i}`).innerText = ''
    $id(`bj-dealer-suit-${i}`).innerHTML = ''
    $id(`bj-player-number-${i}`).innerText = ''
    $id(`bj-player-suit-${i}`).innerHTML = ''
  }

  for (let i = 2; i < 11; i++) {
    $queryAll(`.bj-dealer-card-${i}`).forEach(item => item.classList.add('display-none'))
    $queryAll(`.bj-player-card-${i}`).forEach(item => item.classList.add('display-none'))
  }

  $id('bj-player-amount').innerText = ''
  $id('bj-dealer-amount').innerText = ''

  $id('bj-result').innerText = ''
}

const updateBjUi = (hidden = true) => {
  for (let i = 0; i < dealerCards.length; i++) {
    updateDealerBjUi(i, i === 0 && hidden && !bjSpy)
  }

  for (let i = 0; i < playerCards.length; i++) {
    updatePlayerBjUi(i)    
  }

  const playerValues = evaulateBjValues(playerCards)
  if (!hidden || bjSpy) {
    const playerValue = evaulateFinalBjValues(playerCards)
    $id('bj-player-amount').innerText = playerValue
  } else if (playerValues[0] === playerValues[1] || playerValues[1] > 21) {
    $id('bj-player-amount').innerText = playerValues[0]
  } else {
    $id('bj-player-amount').innerText = `${playerValues[0]} or ${playerValues[1]}`
  }

  if (!hidden || bjSpy) {
    const dealerValue = evaulateFinalBjValues(dealerCards)
    $id('bj-dealer-amount').innerText = dealerValue
  }

  const trueCount = getTrueCount()
  $id('bj-count').innerText = `${count} (${trueCount})`
}

const getTrueCount = () => Math.round(count / (deck.pile.length / 52))

const getBetAmount = () => isBettingHiCount && bjCountBetAmount > 0 ? bjCountBetAmount : betAmount

const drawFromDeckWithCount = () => {
  const card = drawCard(deck)
  count += cardCountValue[card[0]]
  return card
}

export const dealBj = (isAuto) => {
  if (!unlocked) {
    throw 'Locked'
  }

  if (bjState !== 'ready') {
    throw 'Not ready'
  }

  playerCards = []
  dealerCards = []
  resetCardUi()

  State.checkIsBroke()

  isBettingHiCount = getTrueCount() >= bjCountMin && bjCountBetAmount > 0

  State.subtractScore(getBetAmount())

  dealerCards.push(drawFromDeckWithCount())
  dealerCards.push(drawFromDeckWithCount())

  playerCards.push(drawFromDeckWithCount())
  playerCards.push(drawFromDeckWithCount())

  const playerValues = evaulateBjValues(playerCards)
  const dealerValues = evaulateBjValues(dealerCards)

  if (dealerValues[1] === 21 && playerValues[1] === 21) {
    pushBj(true, isAuto)
  } else if (playerValues[1] === 21) {
    winBj(true, isAuto)
  } else if (dealerValues[1] === 21) {
    loseBj(true, false, isAuto)
  } else {
    // TODO: play through auto-guesses
    updateBjUi(true)
    lockButtons()
  }
}

export const hitBj = (isAuto) => {
  playerCards.push(drawFromDeckWithCount())

  const playerValues = evaulateBjValues(playerCards)

  if (playerValues[0] > 21) {
    drawDealerCards()
    loseBj(false, true, isAuto)
  } else if (playerValues[0] === 21 || playerValues[1] === 21) {
    standBj(isAuto)
  } else {
    updateBjUi(true)
  }
}

export const standBj = (isAuto) => {
  drawDealerCards()

  const playerValue = evaulateFinalBjValues(playerCards)
  const dealerValue = evaulateFinalBjValues(dealerCards)
  if (dealerValue > 21) {
    winBj(false, isAuto)
  } else if (dealerValue === playerValue) {
    pushBj(isAuto)
  } else if (playerValue > dealerValue) {
    winBj(false, isAuto)
  } else {
    loseBj(false, false, isAuto)
  }
}

const drawDealerCards = () => {
  while (true) {
    const dealerValues = evaulateBjValues(dealerCards)
    if (dealerValues[0] >= 16 || (dealerValues[1] >= 17 && dealerValues[1] <= 21)) {
      return
    }
    dealerCards.push(drawFromDeckWithCount())
  }
}

const getScoreData = (result, isAuto) => {
  const bet = getBetAmount()

  let playerTotal = evaulateFinalBjValues(playerCards) + ''
  let dealerTotal = evaulateFinalBjValues(dealerCards) + ''
  if (playerTotal.length === 1) {
    playerTotal = ' ' + playerTotal
  }

  if (dealerTotal.length === 1) {
    dealerTotal = ' ' + dealerTotal
  }

  return {
    game: 'bj',
    wager: bet,
    isAuto,
    isBettingHiCount,
    result,
    playerTotal,
    dealerTotal
  }
}

const winBj = (isBlackJack, isAuto) => {
  const bet = getBetAmount()
  if (isBlackJack) {
    $id('bj-result').innerText = 'Blackjack!'
    State.updateScore(Math.floor(bet + bet * blackjackAmount), getScoreData('win ', isAuto))
  } else {
    $id('bj-result').innerText = 'Win!'
    State.updateScore(bet + bet, getScoreData('win ', isAuto))
  }

  updateBjUi(false)
  unlockButtons()
}

const loseBj = (isBlackJack, isBust, isAuto) => {
  State.updateScore(0, getScoreData('lost', isAuto))
  updateBjUi(false) 
  unlockButtons()
  $id('bj-result').innerText = isBust ? 'Bust' : 'Lose'
}

const pushBj = (isAuto) => {
  State.updateScore(getBetAmount(), getScoreData('push', isAuto))
  updateBjUi(false)
  unlockButtons()
  $id('bj-result').innerText = 'Push'
}

const evaluateStrategy = () => {
  const playerValue = evaulateFinalBjValues(playerCards)
  if (bjStrategy === 'hit16') {
    return playerValue < 16
  } else if (bjStrategy === 'dealer-plus') {
    return playerValue <= 11 || (playerValue <= 16 && warCardValue[dealerCards[1][0]] > 4)
  } else if (bjStrategy === 'spy') {
    if (playerValue <= 11) {
      return true
    }

    const dealerValue = evaulateFinalBjValues(dealerCards)
    if (dealerValue >= 16) {
      return playerValue < dealerValue
    } else if (dealerValue >= 12) {
      return false
    } else {
      // const count = getTrueCount()
      console.log('here', count, playerValue, playerValue - (count + 10) <= 0)
      return playerValue - (count + 10) <= 0 && playerValue < 16
    }
  }
}

const runAutoBj = () => {
  dealBj(true)
  while (evaluateStrategy()) {
    if (bjState === 'play') {
      hitBj(true)
    } else {
      break
    }
  }

  if (bjState === 'play') {
    standBj(true)
  }
}

export const updateBj = (delta) => {
  if (bjGuessOn) {
    bjGuessTimer += delta
    if (bjGuessTimer >= bjGuessTime && bjState === 'ready') {
      runAutoBj()
      bjGuessTimer -= bjGuessTime
    }
  }

  if (bjBet.value > maxBet) {
    bjBet.value = maxBet
  }

  // if (warBet.value * 5 > State.dollars) {
  //     betAmount = Math.floor(State.dollars / 5)
  //     warBet.value = Math.floor(State.dollars / 5)
  // }

  if (bjHiCountBet.value > State.dollars) {
    bjHiCountBet.value = 0
    bjCountBetAmount = 0
  }

  if (bjBet.value > State.dollars) {
    betAmount = State.dollars
    bjBet.value = State.dollars

    // disable autoguess if too broke
    $id('bj-auto-guess-box').checked = false
    bjGuessOn = false
    console.warn('Cannot bet money you dont have')
  }
}

export const upgradeBjAmount = () => {
  blackjackAmount = 2
}

export const upgradeAutoBj = (time) => {
  if (time > bjGuessTime) {
    console.warn('out of order, disregarding')
    return
  }

  bjGuessTime = time
  $id('bj-auto-guess').classList.remove('display-none')
  $id('bj-auto-guess-rate').innerText = ` ${formatRate(time)}`
}

export const upgradeMaxBjBet = (maxIncrease) => {
  maxBet += maxIncrease
  $id('bj-max').innerText = formatPrice(maxBet)
  $id('bj-bet').max = maxBet
}

export const showBjCount = () => {
  $id('bj-count-ui').classList.remove('display-none')
}

export const removeBjDecks = (deckNum) => {
  numDecks -= deckNum
  $id('bj-num-decks-ui').classList.remove('display-none')
  $id('bj-num-decks').innerText = numDecks + ''
  deck = makeDeck(numDecks)
  shuffleDeck(deck)
}

export const addBjStrategy = (strategyName) => {
  $id('bj-auto-choices').classList.remove('display-none')
  const select = $id('bj-select')
  const option = $create('option')
  option.value = strategyName

  if (strategyName === 'dealer-plus') {
    option.innerText = 'Dealer+'
  } else if (strategyName === 'spy') {
    option.innerText = 'Spy'
  } else {
    console.error('bad strategy name')
  }

  select.appendChild(option)
}

export const addBjSpy = () => {
  bjSpy = true
}

export const unlockBj = () => {
  unlocked = true
  $id('blackjack').classList.remove('display-none')
  $queryAll('.bjack-results').forEach((item) => item.classList.remove('display-none'))
}
