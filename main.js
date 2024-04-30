import { updateUi } from './ui.js'
import { createStore, updateStore } from './store.js'
import { createCoinFlip, updateCoinFlip } from './games/coin-flip.js'
import { createWar, updateWar } from './games/war.js'
import { createResults } from './results.js'

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
    createResults()
    createStore()
    createCoinFlip()
    createWar()
    // TODO: request anim frame?
    setInterval(mainLoop, 1000 / 60)
}
