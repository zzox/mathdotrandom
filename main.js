import { pushEvent, updateUi } from './ui.js'
import { updateCoinAuto } from './coin-flip.js'

// randomness
export const checkRandom = (percent) => {
    return Math.random() < percent
}

const mainLoop = () => {
    updateUi()
    updateCoinAuto(1000 / 60)
}

// TODO: request anim frame?
setInterval(mainLoop, 1000 / 60)

// tests
// const testGuess = () => {
//     flipCoin('heads')
// }

// const increaseHeadsChance = () => {
//     headsChance += 0.01
// }

// setInterval(increaseHeadsChance, 300)
// setInterval(testGuess, 1000 / 60 * 3)
