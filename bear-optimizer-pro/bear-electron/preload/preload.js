
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('bearAPI', {
  pixListPlanos: () => ipcRenderer.invoke('pix:list-planos'),
  pixGerar: (p) => ipcRenderer.invoke('pix:gerar', p),
  pixConfirmar: (p) => ipcRenderer.invoke('pix:confirmar', p)
});
