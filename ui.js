import State from './state.js'

// minimize fieldsets
document.querySelectorAll('legend').forEach(item => {
  item.onclick = (event) => {
    if (event.target.parentElement.id !== 'value') {
      event.target.parentElement.classList.toggle('minimize')
    }
  }
})

export const $id = (id) => document.getElementById(id)
export const $create = (el) => document.createElement(el)
export const $query = (q) => document.querySelector(q)
export const $queryAll = (q) => Array.from(document.querySelectorAll(q))

const score = $id('score')

export const formatPrice = (amount) => `$${amount.toLocaleString()}`
export const formatPercent = (percent) => Math.round(percent * 100).toFixed(0) + '%'
export const formatRate = (time) => `${Math.round(1000 / time)}/sec`

export const loseWinTie = {
  win: 'WIN!',
  lose: 'Loss',
  tie: 'TIE!'
}

export const updateUi = () => {
  score.innerText = formatPrice(State.dollars)
}

export const suitToHtml = {
  'S': '<span class="spades"></span>',
  'H': '<span class="hearts"></span>',
  'D': '<span class="diamonds"></span>',
  'C': '<span class="clubs"></span>'
}

export const createUi = () => {
  const infoModal = $id('info-modal')
  infoModal.querySelector('button').onclick = () => {
    infoModal.classList.add('display-none')
  }

  const gameOverModal = $id('game-over-modal')
  gameOverModal.querySelector('button').onclick = () => {
    gameOverModal.classList.add('display-none')
  }

  const victoryModal = $id('victory-modal')
  victoryModal.querySelector('button').onclick = () => {
    victoryModal.classList.add('display-none')
  }

  $id('info-link').onclick = () => {
    infoModal.classList.remove('display-none')
  }
}

// from: https://stackoverflow.com/a/27065690
export const dhm = (ms) => {
  const days = Math.floor(ms / (24*60*60*1000))
  const daysms = ms % (24*60*60*1000)
  const hours = Math.floor(daysms / (60*60*1000))
  const hoursms = ms % (60*60*1000)
  const minutes = Math.floor(hoursms / (60*1000))
  const minutesms = ms % (60*1000)
  const sec = Math.floor(minutesms / 1000)

  let dayString = ''
  if (days > 0) {
    dayString = `${days} day${days === 1 ? '' : 's'}, `
  }

  let hourString = ''
  if (hours > 0 || days > 0) {
    hourString = `${hours} hour${hours === 1 ? '' : 's'}, `
  }

  let minString = ''
  if (minutes > 0 || hours > 0 || days > 0) {
    minString = `${minutes} minute${minutes === 1 ? '' : 's'} and `
  }

  let secString = ''
  if (sec > 0) {
    secString = `${sec} second${sec === 1 ? '' : 's'}!`
  }

  return dayString + hourString + minString + secString
}
