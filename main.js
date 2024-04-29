import { updateUi } from './ui.js'
import { updateCoinFlip } from './games/coin-flip.js'
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

// TODO: request anim frame?
setInterval(mainLoop, 1000 / 60)
