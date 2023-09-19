import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";


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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // or like below
// const ambientLight = new THREE.AmbientLight();
// ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.5;
scene.add(ambientLight);

gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);

/**
 * The DirectionalLight will have sun-like effect as if the sun rays were traveling in parallel
 */
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
/*
    To change the direction, move the light
*/
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

/**
 * The HemisphereLight is similar to the AmbientLight but with a different color from the sky than the color coming from the ground
 *
 * color (or skyColor)
 * groundColor
 * intensity
 *
 */
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

/**
 * The PointLight is almost like a lighter
 * The Light starts at an infinitely small point and spread uniformly in every directions
 *
 * color
 * intensity
 *
 */
// const pointLight = new THREE.PointLight(0xff9000, 0.5);
/*
    By default, the light intensity doesn't fade
    We can control the fade distance and how fast it fades with distance and decay
*/
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
/*
    We can also change the position of the pointLight
*/
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

/**
 * The RectAreaLight works like the big rectangle lights you can see on the
 * photoshoot set
 *
 * it's a mix between a directional light and a diffused light
 *
 * color
 * intensity
 * width
 * height
 *
 */
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
/*
    RectAreaLight only works with MeshStandardMaterial and MeshPhysicalMaterial

    You can then move the light and rotate it
    You can also use lookAt(...) to rotate more easily
*/
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

/**
 * The SpotLight is like a flashlight
 * it's a cone of light starting at a point and oriented in a direction
 *
 * color
 * intensity
 * distance
 * angle
 * penumbra
 * decay
 *
 */
const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
/*
    To rotate the SpotLight, we need to use its `target` property to the scene 
    and move it
*/
// console.log(spotLight.target, "spotlight.target");
spotLight.target.position.x = -0.75;
scene.add(spotLight.target);

/*
    Minimal Cost
    * AmbientLight
    * HemisphereLight
    
    Moderate Cost
    * DirectionalLight
    * PointLight
    
    Hight Cost
    * SpotLight
    * RectAreaLight    
*/

/*
  Baking
  
  The idea is to bake the light into the texture
  This can be done in a 3D software
  The drawback is that we cannot move the light and we have to load
  huge textures
 
 */

/*
    Light Helpers
    To assist us positioning the lights, we can use helpers
    * HemisphereLightHelper
    * DirectionLightHelper
    * PointLightHelper
    * RectAreaLightHelper
    * SpotLightHelper
 */

/**
 * Helpers
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

/*
    The SpotLightHelper has no size
    We also need to call its update(...) method on the next frame after moving
    the target
*/
const SpotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(SpotLightHelper);

/*
    ReactAreaLight isn't part of the THREE variable and we must import it
*/
const rectAreaLigthHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLigthHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();