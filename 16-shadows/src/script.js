import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");
// console.log(bakedShadow, "bakedShadow");
// console.log(simpleShadow, "simpleShadow");

/*
    Now that we have lights, we want shadows
    The dark shadows in the back of the objects are called `core shadows`
    What we are missing are the drop shadows


    Shadows have always been a `challenge for real-time` 3D rendering, and
    developers must find tricks to display realistic shadows at a reasonable
    frame rate

    Three.js has a built-in solution
    it's not perfect but it's convenient


    How it Works
    * When you do one render, Three.js will do a render for each light supporting
    shadows.
    * Those renders will simulate what the light sees as if it was a camera
    * During those lights renders, a `MeshDepthMaterial` replaces all meshes
    materials.
    * The lights renders are stored as textures and we call those `shadow maps`
    * Those shadow maps are then used on every materials supposed to receive shadows
    and projected on the geometry.


    How To Activate Shadows
    * Activating shadows is not that harder but optimizing shadows is harder
    
    
    Only the following types of lights support shadows
    * PointLight
    * DirectionalLight
    * SpotLight
    
*/

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

/*
    Activate the shadows on the light with `castShadow`
*/
directionalLight.castShadow = false;

/*
    
*/
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
// directionalLight.shadow.radius = 10;
/*
    You can control the shadow blur with the `radius` property
    The technic doesn't use the proximity of the camera with the object,
    it's a general and cheap blur
*/

/*
    With the camera helper we can see that the amplitude is too large
    Because we are using a `DirectionlLight`, Three.js is using an
    `OrthographicCamera`

    The smaller the values of the amplitude params i.e. top, bottom, left, right
    the more precise the shadows will be. If it's too small, the shadows will be 
    cropped
*/

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
/*
    We can hide the camera helper
*/
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);
// console.log(directionalLight.shadow, "directionalLight.shadow");

// SpotLight
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);

spotLight.castShadow = false;
/*
  We can improve the shadow quality using the same technics that we used for
  the directional light
*/
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
/*
  Because we are using the a SpotLight, Three.js is using a PerspectiveCamera
  We must change the fov property to adapt the amplitude
*/
spotLight.shadow.camera.fov = 30;
/*
  Change the near and far values
*/
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
/*
  We can hide the camera helper
*/
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// PointLight
const pointLight = new THREE.PointLight(0xffffff, 0.3);

pointLight.castShadow = false;
/*
  The camera helper seems to be `PerspectiveCamera` facing downward
  Three.js uses a `PerspectiveCamera` but in all 6 directions and finishes
  downwards

  We can tweak the mapSize, near and far

  Don't change the field of view i.e. fov, because it is going to render
  everything around i.e. it is going to render in all 6 directions and 
  if you change the fov then you are goin to messup with the result
*/
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
/*
  Hide the camera helper
*/
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

/*
  BAKING SHADOWS
  A good alterantive to Three.js shadows is baked shadows
  We integrate shadows on textures that we apply on materials
*/

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// sphere.position.y = 1;
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   new THREE.MeshBasicMaterial({
//     map: bakedShadow,
//   })
// );
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

scene.add(sphere, plane);

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    alphaMap: simpleShadow,
    transparent: true,
  })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

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

/*
    Activating shadow maps on the renderer
*/
renderer.shadowMap.enabled = true;

/*
    SHADOW MAP ALGORITHM
    Different types of algorithms can be applied to shadow maps
    * THREE.BasicShadowMap - Very performant but lousy quality
    * THREE.PCFShadowMap - Less performant but smoother edges (default)
    * THREE.PCFSoftShadowMap - Less performant but even softer edges
    * THREE.VSMShadowMap - Less performant, more constrants, can have
    unexpected results
*/
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
  
  // Update the shadow
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;
  
  
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
