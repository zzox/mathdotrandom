import { pushEvent, updateUi } from './ui.js'

export let dollars = 100
let gameOver = false
export let headsChance = 0.5

const checkRandom = (percent) => {
    return Math.random() < percent
}

export const flipCoin = (side) => {
    checkIsBroke();
    if (side !== 'heads' && side !== 'tails') {
        throw 'Bad coin choice'
    }

    const isHeads = checkRandom(headsChance)
    if (side === 'heads' && isHeads || side === 'tails' && !isHeads) {
        updateScore(1, { choice: side, game: 'coin-flip' })
    } else {
        updateScore(-1, { choice: side, game: 'coin-flip' })
    }
}

const updateScore = (val, scoreData) => {
    dollars += val
    if (dollars === 0) {
        gameOver = true
        alert('game over')
    } else if (dollars < 0) {
        alert('shouldnt be here')
    }

    pushEvent(val, scoreData)

    console.log(dollars, headsChance)
}

const checkIsBroke = () => {
    if (gameOver) {
        // update the screen
        throw 'Game Over!'
    }
}

// TODO: request anim frame?
setInterval(updateUi, 1000 / 60)

// tests
// const testGuess = () => {
//     flipCoin('heads')
// }

// const increaseHeadsChance = () => {
//     headsChance += 0.01
// }

// setInterval(increaseHeadsChance, 300)
// setInterval(testGuess, 1000 / 60 * 3)
