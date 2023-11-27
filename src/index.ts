import { ViewerOptions, Viewer } from './viewer';

const viewerOptions: ViewerOptions = {
  documentRequestedById: document.getElementById('root'),
  browserWindow: window,
  antialias: true,
  rectangleColor: 'white',
  frustumSize: 1000,
  getAspect: (browserWindow: Window) => browserWindow.innerWidth / browserWindow.innerHeight
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const viewer = new Viewer(viewerOptions);

document.body.style.cssText = 'overflow:hidden; margin:0';
