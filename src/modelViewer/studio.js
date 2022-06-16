import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';


const BACK_COLOR = 0xDBE5FF




export const createStudio = (cubeMap) => {
    const container = document.querySelector('#scene');
    container.style.width = window.innerWidth + 'px'
    container.style.height = window.innerHeight + 'px';

    const scene = new THREE.Scene();
    let composer, effectFXAA, outlinePass;

    const forIntercepts = []


    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .01, 100);
    camera.position.set( 0, 2, -6);
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(BACK_COLOR, 1)


    			// postprocessing

				composer = new EffectComposer( renderer );

				const renderPass = new RenderPass( scene, camera );
				composer.addPass( renderPass );

				outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
				composer.addPass( outlinePass );

				// const textureLoader = new THREE.TextureLoader();
				// textureLoader.load( 'textures/tri_pattern.jpg', function ( texture ) {

				// 	outlinePass.patternTexture = texture;
				// 	texture.wrapS = THREE.RepeatWrapping;
				// 	texture.wrapT = THREE.RepeatWrapping;

				// } );
                outlinePass.selectedObjects = forIntercepts


				effectFXAA = new ShaderPass( FXAAShader );
				effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
				composer.addPass( effectFXAA );


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

    document.addEventListener('click', () => {
        //name.style.display = 'none'
    })


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
            title.classList.add('hidden')
            setTimeout(() => { 
                title.classList.remove('hidden')
                title.innerText = currentObject.name
                name.style.display = 'block'}, 110) 
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
        for (let i = 0; i < forIntercepts.length; ++i) {
            if (currentObject === forIntercepts[i]) {
                continue;
            }
            forIntercepts[i].material.color.set(0xFFF6DB)
        }
        if (intersects[0]) {
            if (currentObject !== intersects[0].object) {
                renderer.domElement.style.cursor = 'pointer'
                intersects[0].object.material.color.set(0xff9999)
            }
        } else {
            renderer.domElement.style.cursor = 'auto'
        }
    }


    window.addEventListener( 'click', onPointerClick);
    window.addEventListener( 'pointermove', onPointerMove);



    const name = document.createElement('div')
    name.classList.add('objName')
    document.body.appendChild(name)

    const title = document.createElement('div')
    title.classList.add('title')
    name.appendChild(title)

    const closeName = document.createElement('div')
    closeName.classList.add('closeName')
    name.appendChild(closeName)
    closeName.innerText = 'close'
    closeName.addEventListener('click', () => {
        currentObject.material.color.set(0xFFF6DB)
        currentObject = null
        name.style.display = 'none'
    })





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
            composer.render();
            //renderer.render( scene, camera );
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
