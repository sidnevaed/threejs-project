import { ViewerOptions, Viewer } from './viewer';

const viewerOptions: ViewerOptions = {
  documentRequestedById: document.getElementById('root'),
  browserWindow: window,
  antialias: true,
  rectangleColor: 'white',
  frustumSize: 1000,
  getAspect: (browserWindow: Window) => browserWindow.innerWidth / browserWindow.innerHeight
};

const viewer = new Viewer(viewerOptions);
viewer.render();

document.body.style.cssText = 'overflow:hidden; margin:0';
