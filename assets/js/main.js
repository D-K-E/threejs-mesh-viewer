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
import {
    MeshScene
} from "./meshscene.js";


// ----------- scene globals ----------------------

function recreate_obj() {
    let objtag = document.createElement("object");
    let old_obj = document.getElementById("render-zone");
    old_obj.parentNode.removeChild(old_obj);
    objtag.id = "render-zone";
    objtag.width = 800;
    objtag.height = 600;
    document.body.prepend(objtag);
}
var active_scene = null;

function scene_select() {

    let buttons = document.getElementsByName("scene");
    let selected;
    for (var i = 0; i < buttons.length; i++) {
        let btn = buttons[i];
        if (btn.checked === true) {
            selected = btn.value;
        }
    }

    if (selected === "cube") {
        if (active_scene !== null) {
            recreate_obj();
            active_scene.clear();
        }
        active_scene = new CubeScene(
            "render-zone",
        );
        active_scene.init();
        active_scene.render_scene();
    } else if (selected === "demotic-mesh") {
        if (active_scene !== null) {
            recreate_obj();
            active_scene.clear();
        }

        active_scene = new MeshScene(
            "render-zone",
            // "./assets/obj/Houghton_MS_Ostraca_3150/Houghton_MS_Ostraca_3150.obj"
            "./assets/obj/houghton_ms_ostraca_3150/scene.gltf"
        );
        active_scene.init();
        // active_scene.render_scene();
    } else if (selected === "rosetta-mesh") {
        if (active_scene !== null) {
            recreate_obj();
            active_scene.clear();
        }

        active_scene = new MeshScene(
            "render-zone",
            // "./assets/obj/Houghton_MS_Ostraca_3150/Houghton_MS_Ostraca_3150.obj"
            "./assets/obj/rosetta_stone/scene.gltf"
        );
        active_scene.init();
        // active_scene.render_scene();
    } else if (selected === "osiris-mesh") {
        if (active_scene !== null) {
            recreate_obj();
            active_scene.clear();
        }

        active_scene = new MeshScene(
            "render-zone",
            // "./assets/obj/Houghton_MS_Ostraca_3150/Houghton_MS_Ostraca_3150.obj"
            "./assets/obj/osiris_chapel_temple_of_seti_i_abydos/scene.gltf"
        );
        active_scene.init();
        // active_scene.render_scene();
    }
}

function add_listeners() {
    let buttons = document.getElementsByName("scene");
    let selected;
    for (var i = 0; i < buttons.length; i++) {
        let btn = buttons[i];
        btn.addEventListener("change", scene_select);
    }
}
add_listeners();
