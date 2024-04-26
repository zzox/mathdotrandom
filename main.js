import { updateUi } from './ui.js'

export let dollars = 100
let gameOver = false
let headsChance = 0.5

const checkRandom = (percent) => {
    return Math.random() < percent
}

export const flipCoin = () => {
    checkIsBroke();

    const isHeads = checkRandom(headsChance)
    updateScore(isHeads ? 1 : -1)
}

const updateScore = (val) => {
    dollars += val
    if (dollars === 0) {
        gameOver = true
        alert('game over')
    } else if (dollars < 0) {
        alert('shouldnt be here')
    }
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
//     flipCoin()
// }

// const increaseHeadsChance = () => {
//     headsChance -= 0.01
// }

// setInterval(increaseHeadsChance, 300)
// setInterval(testGuess, 1000 / 60 * 3)
