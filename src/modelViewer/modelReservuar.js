import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import srcModel from '../assets/Rezervyar.fbx'




export const createModel = (onComplete, onProcess = () => {}, onError = () => {}, cubeTex) => {
    let model


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
        object.traverse( function ( child ) {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                child.material = mat
                child.castShadow = true; //default is false
            }
        })
        onComplete()
    });



    return {
        getScene () {
            return model
        },
    }
}
