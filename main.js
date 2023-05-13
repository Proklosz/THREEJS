/**
 * Created by Vincent on 2023. 05. 11..
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


camera.position.z = 5;


const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 5, 10, 10);
controls.update();

const loader = new GLTFLoader();

loader.load( './shp.glb', function ( gltf ) {
    gltf.scene.castShadow=true;
    gltf.scene.receiveShadow=true;
    scene.add( gltf.scene );

}, undefined, function ( error ) {

    console.error( error );

} );


const loader2 = new GLTFLoader();
var mixer;

loader2.load('sea.glb', function(gltf2) {
    const model = gltf2.scene;

    // Set up animations
    mixer = new THREE.AnimationMixer(model);
    const animations = gltf2.animations;
    const clip = animations[0]; // Play the first animation by default
    const action = mixer.clipAction(clip);
    action.play();

    // Add the model to the scene
    model.scale.x=1;
    model.scale.z=1;
    model.position.y=0.2;
    scene.add(model);
        // Add the model to the scene



        // Render the scene



    }

);


const light = new THREE.PointLight( 0xFFFFFF, 1, 100 );
light.position.set( 10,10,10 );
light.castShadow=true;
scene.add( light );

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    mixer.update(0.01);
    renderer.render( scene, camera );
}

animate();
