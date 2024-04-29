import { updateUi } from './ui.js'
import { createCoinFlip, updateCoinFlip } from './games/coin-flip.js'
import { updateStore } from './store.js'

// randomness
export const checkRandom = (percent) => {
    return Math.random() < percent
}

const mainLoop = () => {
    updateUi()
    updateCoinFlip(1000 / 60)
    updateStore(1000 / 60)
}

window.onload = () => {
    createCoinFlip()
    // TODO: request anim frame?
    setInterval(mainLoop, 1000 / 60)
}
