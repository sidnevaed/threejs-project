import { IViewerOptions, Viewer } from './viewer';

const viewerOptions: IViewerOptions = {
  documentBody: document.body,
  windowSize: {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  },
  antialias: true,
  rectangleColor: 'white'
};

const viewer = new Viewer(viewerOptions);
viewer.render();

console.info(viewer);
