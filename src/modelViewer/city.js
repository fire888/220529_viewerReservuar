import * as THREE from 'three';
import { createLoader } from './helpers/loader'

import sceneModelSrc from '../assets/sityModel/citylowcarblendwithbakecamera.gltf'
import '../assets/sityModel/citylowcarblendwithbakecamera.bin'
import '../assets/sityModel/txtrs/aobuild1.png'
import '../assets/sityModel/txtrs/aobuild2.png'
import '../assets/sityModel/txtrs/aobuild3.png'
import '../assets/sityModel/txtrs/aobuild4.png'
import '../assets/sityModel/txtrs/aobuild5.png'
import '../assets/sityModel/txtrs/aobuild6 21312.png'
import '../assets/sityModel/txtrs/aoground2.png'
import '../assets/sityModel/txtrs/aoground23123.png'
import '../assets/sityModel/txtrs/aomountain12312.png'
import '../assets/sityModel/txtrs/aosecondary.png'
import '../assets/sityModel/txtrs/aosecondary2.png'





export const createModel = (onComplete, onProcess = () => {}, onError = () => {}) => {
    let gltf
    let mixer
    let cameraForAnimationMixer
    let speedCam


    const loader = createLoader()
    loader.load(sceneModelSrc, onError, onProcess, model => {
        gltf = model

        const arrTrees = []
        const arrCars = []
        const arrCubes = []

        model.scene.traverse(item => {
            if (!item.name) {
                return;
            }

            if (item.name.includes('ель') || item.name.includes('дерево')) {
                arrTrees.push(item)
            }
            if (item.name.includes('Машина')) {
                arrCars.push(item)
            }
        })

        // for (let i = 1; i < arrTrees.length; ++i) {
        //     const newObj = new THREE.Mesh(
        //         arrTrees[0].geometry,
        //         arrTrees[0].material,
        //     )
        //     newObj.position.x = arrTrees[i].position.x
        //     newObj.position.y = arrTrees[i].position.y
        //     newObj.position.z = arrTrees[i].position.z
        //
        //     model.scene.remove(arrTrees[i])
        //     arrTrees[i].geometry.dispose()
        //     arrTrees[i].material.dispose()
        //
        //     model.scene.add(newObj)
        // }

        // for (let i = 1; i < arrCars.length; ++i) {
        //
        //
        //
        //     arrCars[i].geometry.dispose()
        //     arrCars[i].geometry = arrCars[0].geometry
        //     arrCars[i].geometry.needsUpdate = true
        //     arrCars[i].material.dispose()
        //     arrCars[i].material = arrCars[0].material
        //     arrCars[i].material.needsUpdate = true
        // }

        // for (let i = 0; i < arrCars.length; ++i) {
        //     model.scene.remove(arrCars[i])
        //     arrCars[i].geometry.dispose()
        //     arrCars[i].material.dispose()
        // }

        model.scene.traverse(item => {
            if (!item.name) {
                return;
            }

            // if (
            //     //true
            //     //item.name.includes('Куб')
            //     //|| item.name.includes('Плоскость')
            //     //|| item.name.includes('Икосфера')
            //     //|| item.name.includes('земля')
            //     //|| item.name.includes('Landscape')
            // ) {
            //     arrCubes.push(item)
            // }

            console.log(item.name)
        })

        for (let i = 0; i < arrCubes.length; ++i) {
            model.scene.remove(arrCubes[i])
            arrCubes[i].geometry && arrCubes[i].geometry.dispose()
            arrCubes[i].material && arrCubes[i].material.dispose()
        }



        mixer = new THREE.AnimationMixer( gltf.scene );


        const clips = gltf.animations
        clips.forEach( function ( clip ) {
            if (clip.name !== 'Action') {
                mixer.clipAction( clip ).clampWhenFinished = true;
                mixer.clipAction( clip ).play();
            }
        })



        cameraForAnimationMixer = new THREE.AnimationMixer( gltf.scene.children[1] )
        const cameraForAnimationClip = gltf.animations[1]
        speedCam = 1 / (cameraForAnimationClip.duration - 0.01);
        const cameraForAnimationAction = cameraForAnimationMixer.clipAction(cameraForAnimationClip)
        cameraForAnimationAction.play()


        onComplete()
    })




    let oldPhaseCam = 0

    return {
        getScene () {
            return gltf.scene
        },
        getCamera () {
            return gltf.cameras[0]
        },
        update (n) {
            mixer && mixer.update(0.008 * n)
        },
        updateAnimationCamera (phase) {
            if (!cameraForAnimationMixer) {
               return;
            }
            const diff = phase - oldPhaseCam
            oldPhaseCam = phase

            cameraForAnimationMixer.update(diff / speedCam)
        }
    }
}
