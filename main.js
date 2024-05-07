import { updateUi } from './ui.js'
import { createStore, updateStore } from './store.js'
import { createCoinFlip, updateCoinFlip } from './games/coin-flip.js'
import { createWar, updateWar } from './games/war.js'
import { createPoker, updatePoker } from './games/poker.js'
import { createLogs } from './logs.js'
import { createStats } from './stats.js'
import { createRps,updateRps } from './games/rps.js'

export let time = 0

const MAX_DELTA = 1000 / 30
let last

const mainLoop = (total) => {
  const delta = total - last < MAX_DELTA ? total - last : MAX_DELTA
  updateUi()
  updateCoinFlip(delta)
  updateWar(delta)
  updateStore(delta)
  updatePoker(delta)
  updateRps(delta)
  time += delta
  last = total
  window.requestAnimationFrame(mainLoop)
}

window.onload = () => {
  createLogs()
  createStore()
  createStats()
  createCoinFlip()
  createWar()
  createPoker()
  createRps()
  // TODO: request anim frame?
  last = window.requestAnimationFrame(mainLoop)
}
