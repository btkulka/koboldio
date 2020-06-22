import { LOAD_FILES } from '../types';

export function loadFiles(files) {
    return {
        type: LOAD_FILES,
        payload: files
    };
}