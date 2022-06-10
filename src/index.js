import './styleseets/style.css'

import WebGL from 'three/examples/jsm/capabilities/WebGL';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { createStudio } from './modelViewer/studio'
import { createModel } from './modelViewer/modelReservuar'
import nX from './assets/env/nx.jpg'
import pX from './assets/env/px.jpg'
import nY from './assets/env/ny.jpg'
import pY from './assets/env/py.jpg'
import nZ from './assets/env/nz.jpg'
import pZ from './assets/env/pz.jpg'
import * as THREE from 'three'


const threeApp = () => {


    const loadEnvironmentMaps = (on) => {
        const cubeTexture = new THREE.CubeTextureLoader().load(
            [ pX, nX, pY, nY, pZ, nZ],
            () => {on(cubeTexture)}
        )
    };

    loadEnvironmentMaps(textureCube => {
        const studio = createStudio(textureCube)

        const modelData = createModel(() => {
            const model = modelData.getScene()
            model.scale.set(0.001, 0.001, 0.001)
            model.children[0].geometry.computeBoundingBox()
            studio.addToScene(model)

            const objects = modelData.getObjects()
            for (let key in objects) {
                studio.setToIntercepts(objects[key])
            }




        }, null, null, textureCube)

        let oldTime = Date.now()
        const animate = () => {
            requestAnimationFrame( animate );
            //stats.begin()
            const currentTime = Date.now()
            const diff = currentTime - oldTime
            oldTime = currentTime
            studio.render()
            //stats.end()
        }
        animate()


        const onWindowResize = () =>  {
            studio.resize()
        }
        window.addEventListener('resize', onWindowResize, false)
        onWindowResize()
    })



    // const stats = new Stats();
    // document.body.appendChild(stats.dom)














    const isWebGL = () => {
        if ( WebGL.isWebGLAvailable() ) {
        } else {
            const warning = WebGL.getWebGLErrorMessage();
            document.getElementById( 'container' ).appendChild( warning );

        }
    }
    isWebGL()
}


threeApp()
