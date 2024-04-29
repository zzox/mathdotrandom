import State from '../state.js'
import { checkRandom } from '../main.js'
import { $id, formatPercent } from '../ui.js'

let headsChance = 0.5

let coinGuessOn = false
let coinGuessChoice = 'heads'
let coinGuessTimer = 0
let coinGuessTime = 1000

let resultShowTimer = 0
const resultShowTime = 1000

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

    $id(isHeads ? 'coin-heads' : 'coin-tails').classList.remove('display-none')
    $id(isHeads ? 'coin-tails' : 'coin-heads').classList.add('display-none')
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
    }
}

export const upgradeHeadsChance = (percent) => {
    headsChance += percent
    const coinChance = $id('coin-chances')
    // coinChance.classList.remove('none')
    coinChance.innerHTML = `Heads chance: <span class="bold">${formatPercent(headsChance)}</span> Tails chance: <span class="bold">${formatPercent(1 - headsChance)}</span>`
}

export const upgradeAutoFlip = (time) => {

}
