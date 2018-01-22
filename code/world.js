import {THREE} from './libs.js';
import actor from './actor.js';
import devices from './devices.js';

const width = 640;
const height = 420;
const aspectRatio = width/height;
let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(-25*aspectRatio, 25*aspectRatio, 25, -25, 0.1, 100);
let renderer = new THREE.WebGLRenderer();
let player;

const init = () => {
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);
};

const build = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({color: 0xC3E3AC});
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  const direct = new THREE.DirectionalLight({color: 0xffffff});
  direct.position.set(0.1, 1, 0.5);
  scene.add(direct);

  const ambient = new THREE.AmbientLight(0x95C4D6, 0.2);
  scene.add(ambient);

  camera.position.x = 25;
  camera.position.y = 25;
  camera.position.z = 25;
  camera.lookAt(cube.position);

  player = new actor(scene);
};

const render = () => {
  const context = {
    camera: camera,
    scene: scene,
  };
  devices.update();
  player.update(context);
  renderer.render(scene, camera);
};

export default {
  init,
  build,
  render
}
