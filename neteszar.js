import * as THREE from './three.module.js';

import Stats from './stats.module.js';

import { FlyControls } from './FlyControls.js';
import { GLTFLoader } from './GLTFLoader.js';





const MARGIN = 0;
let SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
let SCREEN_WIDTH = window.innerWidth;

let camera, controls, scene, renderer, stats,model,mixer;
var geo,mat,cube;
let dirLight;



const clock = new THREE.Clock();

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1e7 );
    //scene.add(camera);
    camera.position.z =  5;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );

    dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( - 1, 0, 1 ).normalize();
    scene.add( dirLight );

    geo = new THREE.BoxGeometry(0.01,0.01,0.01);
    mat = new THREE.MeshBasicMaterial();
    cube = new THREE.Mesh(geo,mat);
    scene.add(cube);

    const loader = new GLTFLoader();
    loader.load('cloud.glb', function (gltf) {
        const model0 = gltf.scene;
        model0.castShadow = true;
        model0.receiveShadow = true;
        model0.scale.x = model0.scale.y = model0.scale.z = 5;
        scene.add(model0);
    });

    const loader2 = new GLTFLoader();
    loader2.load('plane.glb', function (gltf2) {
        model = gltf2.scene;

        mixer = new THREE.AnimationMixer(model);
        const animations = gltf2.animations;
        const clip = animations[0]; // Play the first animation by default
        const action = mixer.clipAction(clip);
        action.play();


        model.receiveShadow = true;
        cube.add(model);
        model.position.set(0,-3,-15);


    });











    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor('#97cbff');
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //

    controls = new FlyControls( camera, renderer.domElement );

    controls.movementSpeed = 50;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = true;
    controls.dragToLook = false;

    //

    stats = new Stats();
    document.body.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize );

    // postprocessing





}

function onWindowResize() {

    SCREEN_HEIGHT = window.innerHeight;
    SCREEN_WIDTH = window.innerWidth;

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );


}

function animate() {

    requestAnimationFrame( animate );
    cube.position.copy(camera.position);
    cube.rotation.copy(camera.rotation);
    render();
    stats.update();
    mixer.update(0.05);

}

function render() {



    const delta = clock.getDelta();


    controls.update( 0.02 );

    renderer.render( scene, camera );

}
