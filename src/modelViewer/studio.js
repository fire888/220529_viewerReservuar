import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const BACK_COLOR = 0xDBE5FF


export const createStudio = (cubeMap) => {
    const container = document.querySelector('#scene');
    container.style.width = window.innerWidth + 'px'
    container.style.height = window.innerHeight + 'px';

    const scene = new THREE.Scene();
    //scene.background = cubeMap

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .01, 100);
    camera.position.set( 0, 5, 8);
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio( /*window.devicePixelRatio*/ 1 )
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(BACK_COLOR, 1)
    //renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    //renderer.outputEncoding = THREE.sRGBEncoding;
    //renderer.toneMapping = THREE.ACESFilmicToneMapping;
    //renderer.physicallyCorrectLights = true;

    container.appendChild( renderer.domElement );

    const light = new THREE.PointLight( 0xFFF5E5, .8 )
    light.position.set(20, 20, 40)
    camera.add(light)
    light.castShadow = true; // default false
    light.shadow.mapSize.width = 2048; // default
    light.shadow.mapSize.height = 2048; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default


    const light2 = new THREE.PointLight( 0xFFF5E5, .2 )
    light2.position.set(-30, 20, -40)
    camera.add(light2)

    const ambLight = new THREE.AmbientLight(0x474954)
    scene.add(ambLight)

    const fog = new THREE.Fog( BACK_COLOR, 5, 20)
    scene.fog = fog


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 40000;
    controls.target.set( 0, 0, - 0.2 );
    controls.update();
    controls.maxPolarAngle = Math.PI / 2 - 0.1



    return {
        addToScene(model) {
            scene.add(model)
        },
        render () {
            camera && renderer.render( scene, camera );
        },
        resize () {
            if (!camera) {
                return;
            }
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        },
    }
}
