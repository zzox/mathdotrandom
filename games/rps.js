import State from '../state.js'
import { $id } from '../ui.js'

let betAmount = 1

let resultShowTimer = 0
const resultShowTime = 3000

let rpsBet

export const createRps = () => {
  $id('rock-button').onclick = () => playRps('rock')
  $id('paper-button').onclick = () => playRps('paper')
  $id('scissors-button').onclick = () => playRps('scissors')

  rpsBet = $id('rps-bet')
  rpsBet.onchange = (event) => {
    betAmount = parseInt(event.target.value > State.dollars ? State.dollars : event.target.value)
    if (!betAmount) {
      betAmount = 1
    }
  }
}

const choices = ['rock', 'paper', 'scissors']

const clearRpsUi = () => {
  $id('rps-none').classList.remove('display-none')
  $id('rps-rock').classList.add('display-none')
  $id('rps-paper').classList.add('display-none')
  $id('rps-scissors').classList.add('display-none')
}

const getOppChoice = () => {
  const choice = Math.random()
  if (choice < 1 / 3) {
    return 'rock'
  } else if (choice < 2 / 3) {
    return 'paper'
  } else {
    return 'scissors'
  }
}

export const playRps = (choice) => {
  clearRpsUi()

  const oppChoice = getOppChoice()
  if (choices.indexOf(oppChoice) === (choices.indexOf(choice) + 1) % 3) {
    State.updateScore(-betAmount, {})
  } else if (choices.indexOf(oppChoice) === (choices.indexOf(choice) + 2) % 3) {
    State.updateScore(betAmount, {})
  } else {
    State.updateScore(0, {})
  }

  $id('rps-none').classList.add('display-none')
  for (let i = 0; i < choices.length; i++) {
    if (oppChoice === choices[i]) {
      $id(`rps-${choices[i]}`).classList.remove('display-none')
    }
  }

  resultShowTimer = 0
}

export const updateRps = (delta) => {
  resultShowTimer += delta
  if (resultShowTimer >= resultShowTime) {
    clearRpsUi()
  }

  if (rpsBet.value > State.dollars) {
    betAmount = State.dollars
    rpsBet.value = State.dollars

    console.error('Cannot bet money you dont have')
  }
}
