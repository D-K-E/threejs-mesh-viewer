import {
    OrbitControls,
    THREE,
    GLTFLoader,
    RGBELoader,
    RoughnessMipmapper,
    OBJLoader,
    GUI
} from "./external.js";

// ----------- scene globals ----------------------

let render_zone = document.getElementById("render-zone");
let width = render_zone.width;
let height = render_zone.height;
let camera, scene, renderer;

let camera_pos_x, camera_pos_y, camera_pos_z;

let cameraControls;
let effectController;
let ambientLight, light;

let tess = -1; // force initialization
let cube_width, cube_height, cube_depth;
let shading;
let wireMaterial, flatMaterial, gouraudMaterial;
let phongMaterial, texturedMaterial, reflectiveMaterial;

let cube, textureCube;

// allocate these just once
const diffuseColor = new THREE.Color();
const specularColor = new THREE.Color();

// ------------------------------------------------

function init_materials() {
    const materialColor = new THREE.Color();
    materialColor.setRGB(1.0, 1.0, 1.0);

    wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        wireframe: true
    });

    flatMaterial = new THREE.MeshPhongMaterial({
        color: materialColor,
        specular: 0x000000,
        flatShading: true,
        side: THREE.DoubleSide
    });

    gouraudMaterial = new THREE.MeshLambertMaterial({
        color: materialColor,
        side: THREE.DoubleSide
    });

    phongMaterial = new THREE.MeshPhongMaterial({
        color: materialColor,
        side: THREE.DoubleSide
    });

    // texturedMaterial = new THREE.MeshPhongMaterial({
    //     color: materialColor,
    //     map: textureMap,
    //     side: THREE.DoubleSide
    // });

    // reflectiveMaterial = new THREE.MeshPhongMaterial({
    //     color: materialColor,
    //     envMap: textureCube,
    //     side: THREE.DoubleSide
    // });

}

function init_renderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    render_zone.appendChild(renderer.domElement);

}

function init_camera() {
    // specify the camera with perspective projection
    const aspect_ratio = width / height;
    const fovy = 45;
    const near = 0.1;
    const far = 500;
    camera = new THREE.PerspectiveCamera(fovy, aspect_ratio, near, far);
    camera.position.set(0, 0, -20);

}

function init_scene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAAAAAA);

    scene.add(ambientLight);
    scene.add(light);

}

function init() {

    // create the scene
    scene = new THREE.Scene();

    init_camera();
    // lights
    ambientLight = new THREE.AmbientLight(0x333333); // 0.2

    light = new THREE.DirectionalLight(0xFFFFFF, 1.0);

    // set up the renderer
    init_renderer();

    // Controls
    cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.addEventListener("change", render);

    // MATERIALS
    init_materials();

    // init scene
    init_scene();
    // GUI
    setup_gui();
}


// --------------------------------------------------

function set_effect_controller() {

    effectController = {

        shininess: 40.0,
        ka: 0.17,
        kd: 0.51,
        ks: 0.2,
        metallic: true,

        hue: 0.121,
        saturation: 0.73,
        lightness: 0.66,

        lhue: 0.04,
        lsaturation: 0.01, // non-zero so that fractions will be shown
        llightness: 1.0,

        // bizarrely, if you initialize these with negative numbers, the sliders
        // will not show any decimal places.
        lx: 0.32,
        ly: 0.39,
        lz: 0.7,
        depth: 15,
        width: 1.0,
        height: 1.0,
        newShading: "flat"
    };
}

function createNewCube() {
    if (cube !== undefined) {

        cube.geometry.dispose();
        scene.remove(cube);
    }
    const cubeGeometry = new THREE.BoxGeometry(cube_width, cube_height,
        cube_depth);
    let mat;
    if (shading === "wireframe") {
        mat = wireMaterial;
    } else if (shading === "flat") {
        mat = flatMaterial;
    } else if (shading === "smooth") {
        mat = gouraudMaterial;
    } else if (shading === "glossy") {
        mat = phongMaterial;
    } else if (shading === "textured") {
        mat = texturedMaterial;
    } else {
        mat = reflectiveMaterial;
    }
    cube = new THREE.Mesh(
        cubeGeometry,
        mat
    ); // if no match, pick Phong

    scene.add(cube);
}

function render() {

    if (effectController.width !== cube_width ||
        effectController.height !== cube_height ||
        effectController.depth !== cube_depth ||
        effectController.newShading !== shading) {

        cube_width = effectController.width;
        cube_height = effectController.height;
        cube_depth = effectController.depth;
        shading = effectController.newShading;

        createNewCube();

    }

    // We're a bit lazy here. We could check to see if any material attributes changed and update
    // only if they have. But, these calls are cheap enough and this is just a demo.
    phongMaterial.shininess = effectController.shininess;

    // texturedMaterial.shininess = effectController.shininess;

    diffuseColor.setHSL(effectController.hue, effectController.saturation, effectController.lightness);
    if (effectController.metallic) {

        // make colors match to give a more metallic look
        specularColor.copy(diffuseColor);

    } else {

        // more of a plastic look
        specularColor.setRGB(1, 1, 1);

    }

    diffuseColor.multiplyScalar(effectController.kd);
    flatMaterial.color.copy(diffuseColor);
    gouraudMaterial.color.copy(diffuseColor);
    phongMaterial.color.copy(diffuseColor);
    // texturedMaterial.color.copy(diffuseColor);

    specularColor.multiplyScalar(effectController.ks);
    phongMaterial.specular.copy(specularColor);
    // texturedMaterial.specular.copy(specularColor);

    // Ambient's actually controlled by the light for this demo
    ambientLight.color.setHSL(effectController.hue, effectController.saturation, effectController.lightness * effectController.ka);

    light.position.set(effectController.lx, effectController.ly, effectController.lz);
    light.color.setHSL(effectController.lhue, effectController.lsaturation, effectController.llightness);

    // skybox is rendered separately, so that it is always behind the teapot.
    if (shading === "reflective") {

        scene.background = textureCube;

    } else {

        scene.background = null;

    }

    renderer.render(scene, camera);
}

function set_material_coeff_menu(container, gui) {

    container = gui.addFolder("Material control");

    container.add(effectController, "shininess", 1.0, 400.0, 1.0).name("shininess").onChange(render);
    container.add(effectController, "kd", 0.0, 1.0, 0.025).name("diffuse strength").onChange(render);
    container.add(effectController, "ks", 0.0, 1.0, 0.025).name("specular strength").onChange(render);
    container.add(effectController, "metallic").onChange(render);

}

/**
set material color menu
*/
function set_material_color_menu(container, gui) {
    container = gui.addFolder("Material color");

    container.add(effectController, "hue", 0.0, 1.0, 0.025).name("hue").onChange(render);
    container.add(effectController, "saturation", 0.0, 1.0, 0.025).name("saturation").onChange(render);
    container.add(effectController, "lightness", 0.0, 1.0, 0.025).name("lightness").onChange(render);
}

function set_light_menu(container, gui) {
    container = gui.addFolder("Lighting");

    container.add(effectController, "lhue", 0.0, 1.0, 0.025).name("hue").onChange(render);
    container.add(effectController, "lsaturation", 0.0, 1.0, 0.025).name("saturation").onChange(render);
    container.add(effectController, "llightness", 0.0, 1.0, 0.025).name("lightness").onChange(render);
    container.add(effectController, "ka", 0.0, 1.0, 0.025).name("ambient").onChange(render);

    // light (directional)

    container = gui.addFolder("Light direction");

    container.add(effectController, "lx", -1.0, 1.0, 0.025).name("x").onChange(render);
    container.add(effectController, "ly", -1.0, 1.0, 0.025).name("y").onChange(render);
    container.add(effectController, "lz", -1.0, 1.0, 0.025).name("z").onChange(render);

}

function set_mesh_geometry_control_menu(container, gui) {
    container = gui.addFolder("Geometry control");
    container.add(effectController, "width", 1.0, 100.0, 1.0).name("cube width").onChange(render);
    container.add(effectController, "height", 1.0, 100.0, 1.0).name("cube height").onChange(render);
    container.add(effectController, "depth", 1.0, 100.0, 1.0).name("cube depth").onChange(render);


}


function setup_gui() {
    set_effect_controller();

    const gui = new GUI();

    let container;

    // material attributes
    set_material_coeff_menu(container, gui);

    // material (color)
    set_material_color_menu(container, gui);

    // set light menu
    set_light_menu(container, gui);


    // mesh geometry control menu
    set_mesh_geometry_control_menu(container, gui);

    // shading

    gui.add(effectController,
        "newShading", ["wireframe", "flat",
            "smooth",
            "glossy"
            //"textured", "reflective"
        ]).name("Shading").onChange(render);
}

// animate the object of the scene
const animate = function() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};
init();
render();
