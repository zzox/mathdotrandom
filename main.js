import { updateUi } from './ui.js'
import { createStore, updateStore } from './store.js'
import { createCoinFlip, updateCoinFlip } from './games/coin-flip.js'
import { createWar, updateWar } from './games/war.js'
import { createPoker, updatePoker } from './games/poker.js'
import { createResults } from './results.js'
import { createStats } from './stats.js'

// randomness
export const checkRandom = (percent) => {
    return Math.random() < percent
}

export let time = 0

const MAX_DELTA = 1000 / 60
let last

const mainLoop = (total) => {
    const delta = total - last < MAX_DELTA ? total - last : MAX_DELTA
    updateUi()
    updateCoinFlip(1000 / 60)
    updateWar(1000 / 60)
    updateStore(1000 / 60)
    updatePoker(1000 / 60)
    time += delta
    last = total
    window.requestAnimationFrame(mainLoop)
}

window.onload = () => {
    createResults()
    createStore()
    createStats()
    createCoinFlip()
    createWar()
    createPoker()
    // TODO: request anim frame?
    last = window.requestAnimationFrame(mainLoop)
}
