import State from './state.js'
import { checkRandom } from './main.js'

let coinGuessOn = true
let coinGuessTimer = 0
let coinGuessTime = 1000
let coinGuessChoice = 'heads'
let headsChance = 0.5

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
