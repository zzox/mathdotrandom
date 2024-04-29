import State from './state.js'
import { checkRandom } from './main.js'
import { $id, formatPercent } from './ui.js'

let headsChance = 0.5

let coinGuessOn = true
let coinGuessChoice = 'heads'
let coinGuessTimer = 0
let coinGuessTime = 1000

export const flipCoin = (side, isAuto = false) => {
    State.checkIsBroke();
    if (side !== 'heads' && side !== 'tails') {
        throw 'Bad coin choice'
    }

    const isHeads = checkRandom(headsChance)
    if (side === 'heads' && isHeads || side === 'tails' && !isHeads) {
        State.updateScore(1, { choice: side, game: 'coin-flip', isAuto })
    } else {
        State.updateScore(-1, { choice: side, game: 'coin-flip', isAuto })
    }
}

export const updateCoinAuto = (delta) => {
    if (coinGuessOn) {
        coinGuessTimer += delta
        if (coinGuessTimer >= coinGuessTime) {
            flipCoin(coinGuessChoice, true)
            coinGuessTimer -= coinGuessTime
        }
    }
}

export const upgradeHeadsChance = (percent) => {
    coinGuessOn = true
    headsChance += percent
    const coinChance = $id('coin-chances')
    // coinChance.classList.remove('none')
    coinChance.innerText = `Heads chance: ${formatPercent(headsChance)} Tails chance: ${formatPercent(1 - headsChance)}`
}
