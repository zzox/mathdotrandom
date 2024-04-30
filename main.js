import { updateUi } from './ui.js'
import { updateStore } from './store.js'
import { createCoinFlip, updateCoinFlip } from './games/coin-flip.js'
import { createWar, updateWar } from './games/war.js'

// randomness
export const checkRandom = (percent) => {
    return Math.random() < percent
}

const mainLoop = () => {
    updateUi()
    updateCoinFlip(1000 / 60)
    updateWar(1000 / 60)
    updateStore(1000 / 60)
}

window.onload = () => {
    createCoinFlip()
    createWar()
    // TODO: request anim frame?
    setInterval(mainLoop, 1000 / 60)
}
