const API_KEY = '48131930ee5d463169bcae9e7d14fdba93745c2b94b2adec2879c3e73f4a1b5a'

const tickersHandlers = new Map()

const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)
const AGREGATE_INDEX = '5'

socket.addEventListener('message', e => {
    const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data)
    if(type !== AGREGATE_INDEX || newPrice === undefined){
        return;
    }
    const handlers = tickersHandlers.get(currency) || []
    handlers.forEach(fn => fn(newPrice))
})

// немного сложная для понимания концепция "подписки" на тикеры
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
function subscribeToTickerOnWs(ticker){
    sendToWebsocket({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${ticker}~USD`]
    })
}
function unsubscribeFromTickerOnWs(ticker){
    sendToWebsocket({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${ticker}~USD`]
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
// window.tickers = tickersHandlers
