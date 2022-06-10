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
    camera.position.set( 0, 2, -6);
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



    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();




    let currentObject = null
    const forIntercepts = []

    function onPointerClick( event ) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( pointer, camera );
        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(forIntercepts);
        if (intersects[0]) {
            console.log(intersects[0])
            if (currentObject) {
                if (intersects[0].object.name !== currentObject.name) {
                    currentObject.material.color.set(0xFFF6DB)
                }
            }
            intersects[0].object.material.color.set(0xff0000)
            currentObject = intersects[0].object
            name.innerText = currentObject.name
        }
    }

    function onPointerMove( event ) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( pointer, camera );
        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(forIntercepts);
        if (intersects[0]) {
            renderer.domElement.style.cursor = 'pointer'

        } else {
            renderer.domElement.style.cursor = 'auto'
        }
    }


    window.addEventListener( 'click', onPointerClick);
    window.addEventListener( 'pointermove', onPointerMove);



    const name = document.createElement('div')
    name.classList.add('objName')
    document.body.appendChild(name)


    return {
        addToScene(model) {
            scene.add(model)
        },
        setToIntercepts (mesh) {
            forIntercepts.push(mesh)
        },
        render () {
            if (!camera) {
                return
            }





            renderer.render( scene, camera );



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
