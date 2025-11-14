
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('bearAPI', {
  planosList: () => ipcRenderer.invoke('planos:list'),
  pixGerar: (p) => ipcRenderer.invoke('pix:gerar', p),
  pixConfirmar: (p) => ipcRenderer.invoke('pix:confirmar', p),
  affiliateInvite: (p) => ipcRenderer.invoke('affiliate:invite', p),
  affiliateLogin: (p) => ipcRenderer.invoke('affiliate:login', p),
  adminOverview: (p) => ipcRenderer.invoke('admin:overview', p)
});
