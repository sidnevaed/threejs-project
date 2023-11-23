import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export type ViewerOptions = Readonly<{
  documentRequestedById: HTMLElement | null;
  browserWindow: Window;
  antialias: boolean;
  rectangleColor: 'red' | 'white';
  frustumSize: number;
  getAspect: (browserWindow: Window) => number;
}>

export class Viewer {
  private readonly camera: THREE.OrthographicCamera;
  private readonly scene: THREE.Scene;
  private readonly rectangle: THREE.Mesh;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly controls: OrbitControls;

  constructor(options: ViewerOptions) {
    const {
      documentRequestedById,
      browserWindow,
      antialias,
      rectangleColor,
      frustumSize,
      getAspect
    } = options;

    this.renderer = new THREE.WebGLRenderer({ antialias });
    this.camera = new THREE.OrthographicCamera(
      frustumSize * getAspect(browserWindow) / -2,
      frustumSize * getAspect(browserWindow) / 2,
      frustumSize / 2,
      frustumSize / -2,
      100,
      -100
    );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(300, 300);
    const material = new THREE.MeshBasicMaterial({ color: rectangleColor });
    this.rectangle = new THREE.Mesh(geometry, material);

    this.initRenderer(documentRequestedById, window);
    this.initCamera(window);
    this.initScene();
    this.addRectangle(window);
    this.resizeListener(window, frustumSize, getAspect);
    this.animate();
    this.changeColor();
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private initRenderer(documentRequestedById: ViewerOptions['documentRequestedById'], browserWindow: ViewerOptions['browserWindow']): void {
    this.renderer.setSize(browserWindow.innerWidth, browserWindow.innerHeight);
    if (documentRequestedById != null) { documentRequestedById.appendChild(this.renderer.domElement); }
  }

  private initScene(): void {
    this.scene.background = new THREE.Color('grey');
    this.scene.add(this.camera);
  }

  private initCamera(browserWindow: ViewerOptions['browserWindow']): void {
    this.camera.position.set(
      browserWindow.innerWidth / 2,
      browserWindow.innerHeight / -2,
      1
    );
  }

  private addRectangle(browserWindow: ViewerOptions['browserWindow']): void {
    this.rectangle.position.x = browserWindow.innerWidth / 2;
    this.rectangle.position.y = browserWindow.innerHeight / -2;
    this.scene.add(this.rectangle);
  }

  private resizeListener(window: Window, frustumSize: ViewerOptions['frustumSize'], getAspect: ViewerOptions['getAspect']): void {
    const onWindowResize = ():void => {
      this.camera.left = -frustumSize * getAspect(window) / 2;
      this.camera.right = frustumSize * getAspect(window) / 2;
      this.camera.top = frustumSize / 2;
      this.camera.bottom = -frustumSize / 2;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize, false);
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  private changeColor():void {
    this.renderer.domElement.addEventListener('click', () => {
      this.renderer.domElement.style.backgroundColor = 'blue';
    });
  }
}
