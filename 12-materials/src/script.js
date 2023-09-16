import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from 'lil-gui';

/**
 * Debug
 */
const gui = new GUI();



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughtnessTexture = textureLoader.load(
  "/textures/door/roughness.jpg"
);
// const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
// const matcapTexture = textureLoader.load("/textures/matcaps/2.png");
// const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
// const matcapTexture = textureLoader.load("/textures/matcaps/4.png");
// const matcapTexture = textureLoader.load("/textures/matcaps/5.png");
// const matcapTexture = textureLoader.load("/textures/matcaps/6.png");
// const matcapTexture = textureLoader.load("/textures/matcaps/7.png");
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;

// we can also disable the mipmapping with
gradientTexture.generateMipmaps = false;


const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])


/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
/**
 * MeshBasicMaterial
 */
// const material = new THREE.MeshBasicMaterial({ color: 'red'});
// const material = new THREE.MeshBasicMaterial();

// material.color.set('red');
// material.map = doorColorTexture; // we can also combine the map with the color

// material.wireframe = true;
// material.opacity = 0.5;
// material.transparent = true; // when you want to do the opacity then you also need to do transparent to true
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

/*
There are three sides
    * THREE.FrontSide (default)
    * THREE.BackSide
    * THREE.DoubleSide

*/

/**
 * MeshNormalMaterial
 */
// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true; // this is unique property to MeshNormalMaterial, flatShading will flatten the faces, meaning the normals won't be interpolated between the faces

/**
 * MeshMatcapMaterial
 */
// const material = new THREE.MeshMatcapMaterial();
// MeshMatcapMaterial will display a color by using the normals as a reference to pick the right color on a texture  that looks like a sphere.
// material.matcap = matcapTexture;


/**
 * MeshDepthMaterial
 */
// const material = new THREE.MeshDepthMaterial();
// MeshDepthMaterial will simply color the geometry in white if it is close to the near and black if it's close to the far value of the camera

/**
 * MeshLambertMaterial
 */
// MeshLambertMaterial will react to light
// const material = new THREE.MeshLambertMaterial();

/**
 * MeshPhongMaterial
 */
// MeshPhongMaterial will also react to the light and will have the shininess which is good and weird patterns and blurriness will by gone, but it will be less performant than the MeshLambertMaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// // we can control the ligth reflection with the shininess and the color of this reflection with specular
// material.specular = new THREE.Color(0x1188ff);

/**
 * MeshToonMaterial
 */
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;


/**
 * MeshStandardMaterial
 */
/*
    MeshStandardMaterial uses physically based rendering principles (PBR) 
    Like MeshLambertMaterial and MeshPhongMaterial, it supports light but
    with a more realistic algorithm and better parameters like roughness 
    and metalness
*/
// const material = new THREE.MeshStandardMaterial();
// // material.metalness = 0.45;
// // material.roughness = 0.65;
// material.metalness = 0;
// material.roughness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughtnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;


const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;
/*
    You can tweak the metalness and roughness for different result and test
    other environment maps from the /static/textures/environmentMap/ folder

    For more environment maps go to hdrihaven.com/hris/


    from below website we can convert the HDRI images to the 6 cube map images
    matheowis.github.io/HDRI-to-CubeMap/
/*


/*
    After applying the metalnessMap and roughtnessMap, The reflection looks
    wierd because the metalness and roughtness properties still affect each
    map respectively
*/

/*
    aoMap ("ambient occlusion map") will add shadows where the texture is dark 
    We must add a second set of UV named uv2
*/


gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 64, 64),
  material
);
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));
// scene.add(sphere);

sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
  material
);
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
