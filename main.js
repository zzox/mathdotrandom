import { pushEvent, updateUi } from './ui.js'

// randomness
export const checkRandom = (percent) => {
    return Math.random() < percent
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
