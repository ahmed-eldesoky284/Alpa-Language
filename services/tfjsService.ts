import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

let isInitialized = false;

/**
 * Initializes the TensorFlow.js WebGL backend if it hasn't been already.
 * This prevents the "Platform browser has already been set" warning.
 */
export const initializeTfjs = async () => {
    if (isInitialized) {
        return;
    }
    // Set the backend to WebGL and wait for it to be ready.
    await tf.setBackend('webgl');
    await tf.ready();
    isInitialized = true;
};
