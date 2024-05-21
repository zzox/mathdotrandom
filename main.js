import { $id, $query, createUi, dhm, updateUi } from './ui.js'
import { createStore, updateStore } from './store.js'
import { createCoinFlip, destroyCoinFlip, updateCoinFlip } from './games/coin-flip.js'
import { createWar, destroyWar, updateWar } from './games/war.js'
import { createPoker, destroyPoker, pokerState, updatePoker } from './games/poker.js'
import { createLogs } from './logs.js'
import { createStats } from './stats.js'
import { createRps, destroyRps, updateRps } from './games/rps.js'
import { bjState, createBj, destroyBj, updateBj } from './games/blackjack.js'
import State from './state.js'

export let time = 0

const MAX_DELTA = 1000 / 30
let last

let gameOver = false
let victory = false

const loseGame = () => {
  $id('game-over-modal').classList.remove('display-none')
  destroyCoinFlip()
  destroyWar()
  destroyPoker()
  destroyBj()
  destroyRps()
}

const winGame = () => {
  $id('victory-modal').classList.remove('display-none')
  $query('#victory-modal > fieldset > p').innerText = `You got to 1 million dollars in ${dhm(time)}`
}

const mainLoop = (total) => {
  const delta = total - last < MAX_DELTA ? total - last : MAX_DELTA
  // TEST: const delta = 100
  updateUi()
  updateCoinFlip(delta)
  updateWar(delta)
  updateStore(delta)
  updatePoker(delta)
  updateBj(delta)
  updateRps(delta)
  time += delta
  last = total

  if (!gameOver && pokerState === 'ready' && bjState === 'ready' && State.dollars <= 0) {
    gameOver = true
    loseGame()
  }

  if (!victory && State.dollars >= 1000000) {
    victory = true
    winGame()
  }

  window.requestAnimationFrame(mainLoop)
}

window.onload = () => {
  console.log('hi https://zzox.net')
  createLogs()
  createStore()
  createStats()
  createCoinFlip()
  createWar()
  createPoker()
  createBj()
  createRps()
  createUi()
  last = window.requestAnimationFrame(mainLoop)
}
