import * as THREE from 'three';

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
  private readonly root: HTMLElement;
  private needsDraw: boolean = false;
  private width: number = 1;
  private height: number = 1;

  constructor(options: ViewerOptions) {
    const {
      documentRequestedById,
      browserWindow,
      antialias,
      rectangleColor,
      frustumSize,
      getAspect
    } = options;

    this.root = documentRequestedById ?? document.body;
    this.renderer = new THREE.WebGLRenderer({ antialias });
    this.camera = new THREE.OrthographicCamera(
      frustumSize * getAspect(browserWindow) / -2,
      frustumSize * getAspect(browserWindow) / 2,
      frustumSize / 2,
      frustumSize / -2,
      100,
      -100
    );

    this.scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(300, 300);
    const material = new THREE.MeshBasicMaterial({ color: rectangleColor });
    this.rectangle = new THREE.Mesh(geometry, material);

    this.initRenderer(documentRequestedById, window);
    this.initCamera(window);
    this.initScene();
    this.addRectangle(window);
    this.changeRectangleColor();
    this.root.addEventListener('mousemove', this.#mouseMoveHandler);
    this.animate();
  }

  #mouseMoveHandler = (e: MouseEvent): void => {
    if ((e.buttons & 0x01) === 0) {
      return;
    }

    this.camera.position.x -= e.movementX;
    this.camera.position.y += e.movementY;
  };

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

  private calculateSize(): void {
    const { width, height } = this;

    const newWidth = this.root.clientWidth;
    const newHeight = this.root.clientHeight;

    if (newWidth !== width || newHeight !== height) {
      this.camera.left = -newWidth / 2;
      this.camera.right = newWidth / 2;
      this.camera.top = newHeight / 2;
      this.camera.bottom = -newHeight / 2;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(newWidth, newHeight);
      this.needsDraw = true;
    }
  }

  private animate(): void {
    this.calculateSize();

    if (this.needsDraw) {
      this.needsDraw = false;
      this.renderer.render(this.scene, this.camera);
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  private changeRectangleColor():void {
    this.renderer.domElement.addEventListener('click', () => {
      (this.rectangle.material as THREE.MeshBasicMaterial).color.set('purple');
    });
  }
}
