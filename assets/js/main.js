import {
    OrbitControls,
    THREE,
    GLTFLoader,
    RGBELoader,
    RoughnessMipmapper,
    OBJLoader,
    GUI
} from "./external.js";
import {
    CubeScene
} from "./cubescene.js";


// ----------- scene globals ----------------------

const cube_scene = new CubeScene();
cube_scene.init();
cube_scene.render_scene();
