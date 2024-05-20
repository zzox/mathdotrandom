import State, { checkRandom } from '../state.js'
import { $id, $queryAll, formatPercent, formatPrice, formatRate, loseWinTie } from '../ui.js'

let headsChance = 0.5
let betAmount = 1
let maxBet = 1

let coinGuessOn = false
let coinGuessChoice = 'heads'
let coinGuessTimer = 0
let coinGuessTime = 1000

let resultShowTimer = 0
const resultShowTime = 1000

let coinBet

export const createCoinFlip = () => {
  $id('heads-button').onclick = () => flipCoin('heads')
  $id('tails-button').onclick = () => flipCoin('tails')

  coinBet = $id('coin-bet')
  coinBet.onchange = (event) => {
    betAmount = parseInt(event.target.value > State.dollars ? State.dollars : event.target.value)
    if (!betAmount) {
      betAmount = 1
    }
  }

  $id('coin-auto-guess-box').onchange = (event) => {
    coinGuessOn = event.target.checked
  }

  $id('coin-auto-guess-heads').onchange = (event) => {
    if (event.target.checked) {
      coinGuessChoice = 'heads'
    }
  }

  $id('coin-auto-guess-tails').onchange = (event) => {
    if (event.target.checked) {
      coinGuessChoice = 'tails'
    }
  }
}

export const flipCoin = (side, isAuto = false) => {
  State.checkIsBroke()
  if (side !== 'heads' && side !== 'tails') {
    throw 'Bad coin choice'
  }

  let result
  const isHeads = checkRandom(headsChance)
  if ((side === 'heads' && isHeads) || (side === 'tails' && !isHeads)) {
    result = 'win'
    State.updateScore(betAmount, { choice: side, game: 'coin-flip', isAuto })
  } else {
    result = 'lose'
    State.updateScore(-betAmount, { choice: side, game: 'coin-flip', isAuto })
  }

  $id(isHeads ? 'coin-heads' : 'coin-tails').classList.remove('display-none')
  $id(isHeads ? 'coin-tails' : 'coin-heads').classList.add('display-none')
  $queryAll('#coin-result-text').forEach(item => item.innerText = loseWinTie[result])
  $id('coin-flat').classList.add('display-none')
  resultShowTimer = 0
}

export const updateCoinFlip = (delta) => {
  if (coinGuessOn) {
    coinGuessTimer += delta
    if (coinGuessTimer >= coinGuessTime) {
      flipCoin(coinGuessChoice, true)
      coinGuessTimer -= coinGuessTime
    }
  }

  resultShowTimer += delta
  if (resultShowTimer >= resultShowTime) {
    $id('coin-flat').classList.remove('display-none')
    $id('coin-heads').classList.add('display-none')
    $id('coin-tails').classList.add('display-none')
    $queryAll('#coin-result-text').forEach(item => item.innerText = '')
  }

  if (coinBet.value > maxBet) {
    coinBet.value = maxBet
  }

  if (coinBet.value > State.dollars) {
    betAmount = State.dollars
    coinBet.value = State.dollars

    // disable autoguess if too broke
    $id('coin-auto-guess-box').checked = false
    coinGuessOn = false
    console.warn('Cannot bet money you dont have')
  }
}

export const upgradeHeadsChance = (percent) => {
  headsChance += percent
  const coinChance = $id('coin-chances')
  // coinChance.classList.remove('none')
  coinChance.innerHTML = `Heads chance: <span class="bold">${formatPercent(headsChance)}</span> Tails chance: <span class="bold">${formatPercent(1 - headsChance)}</span>`
}

export const upgradeAutoFlip = (time) => {
  if (time > coinGuessTime) {
    console.warn('higher time, disregarding')
    return
  }

  coinGuessTime = time
  $id('coin-auto-guess').classList.remove('display-none')
  $id('coin-auto-guess-rate').innerText = ` ${formatRate(time)}`
}

export const upgradeMaxCoinBet = (newMax) => {
  maxBet += newMax
  $id('coin-max').innerText = formatPrice(maxBet)
  $id('coin-bet').max = maxBet
}

export const destroyCoinFlip = () => {
  $id('heads-button').disabled = true
  $id('tails-button').disabled = true
}
