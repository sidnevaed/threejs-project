import { OrthographicCamera, Scene, Mesh, WebGLRenderer, PlaneGeometry, MeshBasicMaterial, Color } from 'three';

type TWindowSize = Pick<Window, 'innerHeight' | 'innerWidth'>;

export type IViewerOptions = Readonly<{
  documentBody: Document['body'];
  windowSize: TWindowSize;
  antialias: boolean;
  rectangleColor: 'red' | 'white';
}>


export class Viewer {
  private readonly camera: OrthographicCamera;
  private readonly scene: Scene;
  private readonly rectangle: Mesh;
  private readonly renderer: WebGLRenderer;


  constructor(options: IViewerOptions) {
    const { documentBody, windowSize, antialias, rectangleColor } = options;

    this.renderer = new WebGLRenderer({ antialias });
    this.camera = new OrthographicCamera(
      //  Цифры могут быть переданы через объект options
      windowSize.innerWidth / - 2,
      windowSize.innerWidth / 2,
      windowSize.innerHeight / 2,
      windowSize.innerHeight / - 2,
      100,
      -100
    );

    this.scene = new Scene();

    // Цифры могут быть переданы через объект options
    const geometry = new PlaneGeometry(300, 300);
    const material = new MeshBasicMaterial({color: rectangleColor});
    this.rectangle = new Mesh(geometry, material);

    this.initRenderer(documentBody, windowSize);
    this.initCamera(windowSize);
    this.initScene();
    this.addRectangle(windowSize);
  }

  public render (): void {
    this.renderer.render(this.scene, this.camera);
  }

  private initRenderer(documentBody: Document['body'], windowSize: TWindowSize): void {
    this.renderer.setSize(windowSize.innerWidth, windowSize.innerHeight);
    documentBody.appendChild(this.renderer.domElement);
  }

  private initScene(): void {
    this.scene.background = new Color("grey");
    this.scene.add(this.camera);
  }

  private initCamera (windowSize: IViewerOptions['windowSize']): void {
    this.camera.position.set(
      windowSize.innerWidth / 2,
      windowSize.innerHeight / -2,
      1
    );
  }

  private addRectangle (windowSize: IViewerOptions['windowSize']): void {
    this.rectangle.position.x = windowSize.innerWidth / 2;
    this.rectangle.position.y = windowSize.innerHeight / -2;
    this.scene.add(this.rectangle);
  }
}
