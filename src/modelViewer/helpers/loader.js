import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
const DRACO_STATIC_PATH = 'draco/gltf/'

export const createLoader = () => {
    let _gltf
    let _onProgressCallback = () => {}
    let _onErrorCallback = () => {}
    let _onLoadSuccessCallback = () => {}

    const onLoadProcess = val => {
        const v = val.loaded / val.total * 100
        console.log( v + '% loaded' );
        _onProgressCallback(v)
    }

    const onLoadError = (err) => {
        console.log( 'An error happened', err )
        _onErrorCallback(err)
    }

    const onLoadSuccess = (model) => {
        _gltf = model
        _onLoadSuccessCallback(model)
    }


    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(DRACO_STATIC_PATH)
    dracoLoader.setDecoderConfig({type: 'js'})
    const loader = new GLTFLoader()
    loader.setDRACOLoader( dracoLoader )


    return {
        load: (path, onErr, onProgress, onDone) => {
            onErr && (_onErrorCallback = onErr)
            onProgress && (_onProgressCallback = onProgress)
            onDone && (_onLoadSuccessCallback = onDone)

            loader.load(path, onLoadSuccess, onLoadProcess, onLoadError)
        }
    }
}