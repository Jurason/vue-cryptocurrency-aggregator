const API_KEY = '48131930ee5d463169bcae9e7d14fdba93745c2b94b2adec2879c3e73f4a1b5a'

const tickersHandlers = new Map()

const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)
const AGREGATE_INDEX = '5'
const INVALID_SUB_INDEX = '500'


socket.addEventListener('message', e => {
    let { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice, PARAMETER: param } = JSON.parse(e.data)
    if(type === INVALID_SUB_INDEX){
        currency = param.split('~')[2]
        // tickersHandlers.set(currency, () => {})
        newPrice = 'null'
    }
    if(type !== AGREGATE_INDEX || newPrice === undefined){
        return;
    }
    const handlers = tickersHandlers.get(currency) || []
    handlers.forEach(fn => fn(newPrice))
})

// сложная для понимания концепция "подписки" на тикеры
// то есть мы не решаем задачу в лоб, а "подготавливаем условия для её решения"

// WebSocket
function sendToWebsocket(message){
    const stringifiedMessage = JSON.stringify(message)
    if(socket.readyState === WebSocket.OPEN){
        socket.send(stringifiedMessage)
        return;
    }
    socket.addEventListener('open', () => {
        socket.send(stringifiedMessage)
    }, {once: true})
}
function subscribeToTickerOnWs(ticker, currency = 'USD'){
    sendToWebsocket({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${ticker}~${currency}`]
    })
}
function unsubscribeFromTickerOnWs(ticker, currency = 'USD'){
    sendToWebsocket({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${ticker}~${currency}`]
    })
}
// fulfilling tickersHandler by cb function
export const subscribeToTicker = (ticker, cb) => {              // subscribe on current ticker
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
    subscribeToTickerOnWs(ticker)
}
export const unsubscribeFromTicker = ticker => {            // unsubscribe
    tickersHandlers.delete(ticker)
    unsubscribeFromTickerOnWs(ticker)
}

