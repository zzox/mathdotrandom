import State from './state.js'
import { checkRandom } from './main.js'

export const flipCoin = (side) => {
    State.checkIsBroke();
    if (side !== 'heads' && side !== 'tails') {
        throw 'Bad coin choice'
    }

    const isHeads = checkRandom(State.headsChance)
    if (side === 'heads' && isHeads || side === 'tails' && !isHeads) {
        State.updateScore(1, { choice: side, game: 'coin-flip' })
    } else {
        State.updateScore(-1, { choice: side, game: 'coin-flip' })
    }
}
