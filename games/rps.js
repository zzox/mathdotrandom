import State from '../state.js'
import { $id, $queryAll, loseWinTie } from '../ui.js'
import { checkNumber } from '../util.js'

let betAmount = 1

let resultShowTimer = 0
const resultShowTime = 3000

let rpsBet

const rpsResultText = {
  rock: '  Rock  ',
  paper: '  Paper ',
  scissors: 'Scissors'
}

export const createRps = () => {
  $id('rock-button').onclick = () => playRps('rock')
  $id('paper-button').onclick = () => playRps('paper')
  $id('scissors-button').onclick = () => playRps('scissors')

  rpsBet = $id('rps-bet')
  rpsBet.onchange = (event) => {
    betAmount = checkNumber(event.target.value, State.dollars)
    rpsBet.value = betAmount
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

const playRps = (choice) => {
  clearRpsUi()

  const oppChoice = getOppChoice()
  const data = {
    game: 'rps',
    choice: rpsResultText[choice],
    oppChoice: rpsResultText[oppChoice]
  }

  let result
  if (choices.indexOf(oppChoice) === (choices.indexOf(choice) + 1) % 3) {
    data.result = 'lost'
    result = 'lose'
    State.updateScore(-betAmount, data)
  } else if (choices.indexOf(oppChoice) === (choices.indexOf(choice) + 2) % 3) {
    result = 'win'
    data.result = 'won '
    State.updateScore(betAmount, data)
  } else {
    result = 'tie'
    data.result = 'tied'
    State.updateScore(0, data)
  }

  $id('rps-none').classList.add('display-none')
  for (let i = 0; i < choices.length; i++) {
    if (oppChoice === choices[i]) {
      $id(`rps-${choices[i]}`).classList.remove('display-none')
    }
  }

  $queryAll('#rps-result-text').forEach(item => {
    item.innerText = loseWinTie[result]
  })
  resultShowTimer = 0
}

export const updateRps = (delta) => {
  $id('rock-button').disabled = betAmount <= 0
  $id('paper-button').disabled = betAmount <= 0
  $id('scissors-button').disabled = betAmount <= 0

  resultShowTimer += delta
  if (resultShowTimer >= resultShowTime) {
    clearRpsUi()
  }

  if (rpsBet.value > State.dollars) {
    betAmount = State.dollars
    rpsBet.value = State.dollars

    console.warn('Cannot bet money you dont have')
  }
}

export const unlockRps = () => {
  $id('rps').classList.remove('display-none')
  $id('rps-info').classList.remove('display-none')
  $queryAll('.rps-results').forEach((item) => item.classList.remove('display-none'))
}

export const destroyRps = () => {
  $id('rock-button').disabled = true
  $id('paper-button').disabled = true
  $id('scissors-button').disabled = true
}
