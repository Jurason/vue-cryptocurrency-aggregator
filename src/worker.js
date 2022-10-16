
const API_KEY = '48131930ee5d463169bcae9e7d14fdba93745c2b94b2adec2879c3e73f4a1b5a'

const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)

const broadcastChannel = new BroadcastChannel('WebSocketChannel')

socket.onopen = () => broadcastChannel.postMessage({ type: "WSState", state: socket.readyState });
socket.onclose = () => broadcastChannel.postMessage({ type: "WSState", state: socket.readyState });

socket.addEventListener('message', e => {
    const parseData = {data: JSON.parse(e.data), type: 'message'}
    broadcastChannel.postMessage(parseData);
})

// Не решена проблема подписок из разных вкладок

// addEventListener('connect', e => {
//     // Get the MessagePort from the event. This will be the
//     // communication channel between SharedWorker and the Tab
//     console.log('e.ports[0]:', e.ports[0])
//
//     const port = e.ports[0];
//     port.onmessage = msg => {
//         // Forward this message to the ws connection.
//         socket.send(JSON.stringify({ data:  msg.data }));
//     };
//     // We need this to notify the newly connected context to know
//     // the current state of WS connection.
//     port.postMessage({ state: socket.readyState, type: "WSState"});
// });

export function sendToWebsocket(message){
    const stringifiedMessage = JSON.stringify(message)
    if(socket.readyState === WebSocket.OPEN){
        socket.send(stringifiedMessage)
        return;
    }
    socket.addEventListener('open', () => {
        socket.send(stringifiedMessage)
    }, {once: true})
}
export function subscribeToTickerOnWs(ticker, currency = 'USD'){
    sendToWebsocket({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${ticker}~${currency}`]
    })
}
export function unsubscribeFromTickerOnWs(ticker, currency = 'USD'){
    sendToWebsocket({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${ticker}~${currency}`]
    })
}