// Code to execute on Yandex Music page. Throws callbacks to app through IPC.

init = () => {
    const { ipcRenderer } = require('electron')
    window.ipcRenderer = ipcRenderer
    window.injectCallbacks = () => {
        externalAPI.on(externalAPI.EVENT_READY, () => {
            ipcRenderer.send('EVENT_READY', null)
        })

        externalAPI.on(externalAPI.EVENT_TRACK, () => {
            ipcRenderer.send('EVENT_TRACK', null)
        })

        externalAPI.on(externalAPI.EVENT_STATE, () => {
            ipcRenderer.send('EVENT_STATE', null)
        })

        externalAPI.on(externalAPI.EVENT_CONTROLS, () => {
            ipcRenderer.send('EVENT_CONTROLS', null)
        })

        externalAPI.on(externalAPI.EVENT_PROGRESS, () => {
            ipcRenderer.send('EVENT_PROGRESS', null)
        })

        externalAPI.on(externalAPI.EVENT_ADVERT, (arg) => {
            ipcRenderer.send('EVENT_ADVERT', arg)
        })
    }
}

init();
