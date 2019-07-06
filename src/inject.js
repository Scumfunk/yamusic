init = () => {
    const { ipcRenderer } = require('electron')
    window.ipcRenderer = ipcRenderer
    window.injectCallbacks = () => {
        externalAPI.on(externalAPI.EVENT_TRACK, () => {
            ipcRenderer.send('EVENT_TRACK', null)
        })

        externalAPI.on(externalAPI.EVENT_STATE, () => {
            ipcRenderer.send('EVENT_STATE', null)
        })

        externalAPI.on(externalAPI.EVENT_CONTROLS, () => {
            ipcRenderer.send('EVENT_CONTROLS', null)
        })
    }
}

init();

//console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
// ipcRenderer.send('asynchronous-message', 'ping')