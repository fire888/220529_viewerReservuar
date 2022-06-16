import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import srcModel from '../assets/Rezervyar_01.fbx'




export const createModel = (onComplete, onProcess = () => {}, onError = () => {}, cubeTex) => {
    let model
    const elements = {}


    const mat = new THREE.MeshPhongMaterial({
        color: 0xFFF6DB,
        emissive: 0x09140B,
        specular: 0xffffff,
        shininess: 40,
        //bumpMap: sc.mapBump,
        bumpScale: 0.4,
        envMap: cubeTex,
        reflectivity: 0.2,
        transparent: true
    });

    const loader = new FBXLoader();
    loader.load( srcModel, object => {
        model = object
        console.log(model)
        object.traverse( function ( child ) {
            if (child.isMesh) {
                //child.castShadow = true
                //child.receiveShadow = true

                child.material = mat
                if (child.name.includes('Element')) {
                    const mat = new THREE.MeshPhongMaterial({
                        //color: Math.random() * 0xFFFFFF,
                        color: 0xFFF6DB,
                        emissive: 0x09140B,
                        specular: 0xffffff,
                        shininess: 40,
                        //bumpMap: sc.mapBump,
                        bumpScale: 0.4,
                        envMap: cubeTex,
                        reflectivity: 0.2,
                        transparent: true
                    });

                    child.material = mat

                    elements[child.name] = child
                }
            }
        })
        onComplete()
    });

    console.log(elements)

    return {
        getScene () {
            return model
        },
        getObjects() {
            return elements
        }
    }
}
