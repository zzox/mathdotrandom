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

export const formatPrice = (amount) => `$${amount}`
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
