/* THREE JS BOILERPLATE SCENE SETUP */
import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
    Clock
} from 'three';

//Import OrbitControls from three examples folder.
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//Import dat.gui to create GUI controls to visualise and debug parameters
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

/*---------------------------------------------------------------------------------------*/

//Create a scene
const scene = new Scene();

/*---------------------------------------------------------------------------------------*/

//Create some geometry
const box = new BoxGeometry(0.5, 0.5, 0.5)

//Create materials, we can apply them to the same geometry to make different meshes
const materialOrange = new MeshBasicMaterial( {color: 'orange'} );
const materialBlue = new MeshBasicMaterial( {color: 'blue'} );

//Create mesh to display geometry
const boxMesh1 = new Mesh(box, materialOrange);
const boxMesh2 = new Mesh(box, materialBlue);

//Move the second mesh and add both meshes to scene
boxMesh2.position.x += 1.5;
scene.add(boxMesh1);
scene.add(boxMesh2);

/*---------------------------------------------------------------------------------------*/

/* Debugging parameters*/

//Add controls and objects to GUI
const gui = new GUI();
const min = 0;
const max = 3;
const step = 0.1;
const name = 'y-axis';
gui.add(boxMesh1.position, 'y', min, max, step);

//Can use method chaining to set props
gui.add(boxMesh2.position, 'x').min(0).max(3).step(0.1).name('x-axis')

//dat.GUI will deduce input type, in this case visibility is a boolean, will be
//added to GUI as a checkbox.
gui.add(boxMesh1, 'visible').name('Toggle visibility.');

//Can also group parameters together in 'folders' and sub-folders
const box2Folder = gui.addFolder('Box2')
box2Folder.add(boxMesh2.position, 'x').min(0).max(3).step(0.1).name('x-axis');
box2Folder.add(boxMesh2.position, 'y').min(0).max(3).step(0.1).name('y-axis');

/*---------------------------------------------------------------------------------------*/

//Retrieve canvas from DOM
const canvas = document.getElementById('three-canvas');

//Set up camera size to be the same as the host canvas
const size = 
{
    width: canvas.clientWidth,
    height: canvas.clientHeight
}

const camera = new PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;

//Add camera to scene
scene.add(camera);

//Add axes helper to the scene
const axesHelper = new AxesHelper();
axesHelper.material.depthTest = false;
axesHelper.renderOrder = 2;
scene.add(axesHelper);

//Add grid helpers
const grid = new GridHelper();
grid.material.depthTest = false;
grid.renderOrder = 1;
scene.add(grid);

/*---------------------------------------------------------------------------------------*/

/*Lights*/
const intensity = 1;
const color = 0xFFFFFF;

//Ambient light, multiplies color of material by intensity of light, flat looking.
const ambientLight = new AmbientLight(color, intensity);
scene.add(ambientLight);

//Hemisphere light, is like a dome light, multiplying the surfaces facing up by
//one color and those facing down by another.
const skyColor= 0xb1e1ff;
const groundColor= 0xb97a20;
const hemisphereLight = new HemisphereLight(skyColor, groundColor, intensity);
scene.add(hemisphereLight);

/*---------------------------------------------------------------------------------------*/

//Set up renderer;
const renderer = new WebGLRenderer({
    canvas: canvas,
	antialias: true,
    //Set background to transparent so that we can control it 
    //through HTML and CSS code. Can also use renderer.setClearColor().
	alpha: true, 
	powerPreference: 'high-performance'
});

//Pixel ration is the number of pixels on screep per pixel unit
//of the software being used. Limit value to 2 to prevent using 
//too many resources. This fixes blurriness on some devices with
//higher pixel ratios.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Set render size to match camera (Avoid distortion)
//Notice how we are passing false as a third argument 
//to renderer.setsize(). This prevents Three.js from 
//setting the style of the canvas HTML element.
renderer.setSize(size.width, size.height, false);

//Render the scene
renderer.render(scene, camera);

//Add event listener to window in order to resize renderer and camera when
//window changes dimensions and ratio.
window.addEventListener('resize', () => {

    size.width = canvas.clientWidth;
    size.height = canvas.clientHeight;
    camera.aspect = size.width/size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height, false);

});

/*---------------------------------------------------------------------------------------*/
//Set up user controls

/*OrbitControls*/
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/*Advanced controls from the makers of IFC.js CameraControls*/
import CameraControls from 'camera-controls';
import { AmbientLight } from 'three';
import { HemisphereLight } from 'three';
import { DirectionalLight } from 'three';
import { SpotLight } from 'three';
import { AxesHelper } from 'three';
import { GridHelper } from 'three';

const subsetOfTHREE = {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp
  }
};

CameraControls.install( { THREE: subsetOfTHREE } );

//Set up controls
const clock = new Clock();
const cameraControls = new CameraControls( camera, canvas );

/*---------------------------------------------------------------------------------------*/

/*Animation Loop*/

//The following function can be named anything but it's important 
//that it contain a call to the global function requestAnimationFrame().
//We are going to use this function to rotate the cube continuously.
function animate(){
    //Update camera controls
    const delta = clock.getDelta();
    cameraControls.update( delta );

    renderer.render(scene, camera); //render the scene every frame
    requestAnimationFrame(animate); //request next frame, recursive call
}

//call to our function will recursively call itself
animate();