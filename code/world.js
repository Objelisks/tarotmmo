import {THREE} from './libs.js';
import actor from './actor.js';

const width = 640;
const height = 420;
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
let player;

const init = () => {
  console.log('init');
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);
};

const build = () => {
  console.log('build');
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({color: 0xC3E3AC});
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  const direct = new THREE.DirectionalLight({color: 0xffffff});
  direct.position.set(0.1, 1, 0.5);
  scene.add(direct);

  const ambient = new THREE.AmbientLight(0x95C4D6, 0.2);
  scene.add(ambient);

  camera.position.x = 5;
  camera.position.y = 5;
  camera.position.z = 5;
  camera.lookAt(cube.position);

  player = new actor(scene);
  console.log(player);
};

const render = () => {
  player.update();
  renderer.render(scene, camera);
};

export default {
  init,
  build,
  render
}
