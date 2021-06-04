// cube scene
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
    CameraWidget
} from "./widget.js";


class CubeScene {
    constructor(render_zone_id = "render-zone") {
        this._render_zone = document.getElementById(render_zone_id);
        this._width = this.render_zone.width;
        this._height = this.render_zone.height;
        this._camera = null;
        this._scene = null;
        this._renderer = null;


        this._camera_controller = null;
        this._effect_controller = null;
        this._ambient_light = null;
        this._light = null;
        this._light_helper = null;

        this._cube_width = 1.0;
        this._cube_height = 1.0;
        this._cube_depth = 1;
        this._shading = null;
        this._wire_material = null;
        this._flat_material = null;
        this._gouraud_material = null;
        this._phong_material = null;
        this._textured_material = null;
        this._reflective_material = null;

        this._cube = null;
        this._texture_cube = null;

        // allocate these just once
        this._diffuse_color = new THREE.Color();
        this._specular_color = new THREE.Color();
    }
    check_null(obj, message) {
        if (obj === null) {
            throw message;
        }
        return obj;
    }
    get cube() {
        return this.check_null(this._cube, "scene cube is null");
    }
    set cube(s) {
        this._cube = s;
    }
    get render_zone() {
        return this.check_null(this._render_zone, "render zone is null");
    }
    get width() {
        return this.check_null(this._width, "cube width is null");
    }
    set width(s) {
        this._width = s;
    }
    get height() {
        return this.check_null(this._height, "cube height is null");
    }
    set height(s) {
        this._height = s;
    }
    get camera() {
        return this.check_null(this._camera, "camera is null");
    }
    set camera(s) {
        this._camera = s;
    }
    get camera_pos_x() {
        return this.check_null(this._camera_pos_x, "camera pos x is null");
    }
    set camera_pos_x(x) {
        this._camera_pos_x = x;
    }
    get camera_pos_y() {
        return this.check_null(this._camera_pos_y, "camera pos y is null");
    }
    set camera_pos_y(y) {
        this._camera_pos_y = y;
    }
    get camera_pos_z() {
        return this.check_null(this._camera_pos_z, "camera pos z is null");
    }
    set camera_pos_z(z) {
        this._camera_pos_z = z;
    }
    // camera controls
    get camera_controller() {
        return this.check_null(this._camera_controller,
            "camera controller is null");
    }
    set camera_controller(s) {
        this._camera_controller = s;
    }
    get effect_controller() {
        return this.check_null(this._effect_controller,
            "effect controller is null");
    }
    set effect_controller(s) {
        this._effect_controller = s;
    }

    get ambient_light() {
        return this.check_null(this._ambient_light,
            "ambient light is null");
    }
    set ambient_light(s) {
        this._ambient_light = s;
    }
    get light() {
        return this.check_null(this._light,
            "light is null");
    }
    set light(s) {
        this._light = s;
    }
    get light_helper() {
        return this.check_null(this._light_helper, "light helper is null");
    }
    set light_helper(s) {
        this._light_helper = s;
    }

    get cube_width() {
        return this.check_null(this._cube_width,
            "cube width is null");
    }
    set cube_width(s) {
        this._cube_width = s;
    }

    get cube_height() {
        return this.check_null(this._cube_height,
            "cube height is null");
    }
    set cube_height(s) {
        this._cube_height = s;
    }

    get cube_depth() {
        return this.check_null(this._cube_depth,
            "cube depth is null");
    }
    set cube_depth(s) {
        this._cube_depth = s;
    }

    get shading() {
        return this.check_null(this._shading,
            "shading is null");
    }
    set shading(s) {
        this._shading = s;
    }

    get wire_material() {
        return this.check_null(this._wire_material,
            "wire material is null");
    }
    set wire_material(s) {
        this._wire_material = s;
    }

    get flat_material() {
        return this.check_null(this._flat_material,
            "flat material is null");
    }
    set flat_material(s) {
        this._flat_material = s;
    }

    get gouraud_material() {
        return this.check_null(this._gouraud_material,
            "gouraud material is null");
    }
    set gouraud_material(s) {
        this._gouraud_material = s;
    }

    get phong_material() {
        return this.check_null(this._phong_material,
            "phong material is null");
    }
    set phong_material(s) {
        this._phong_material = s;
    }
    get textured_material() {
        return this.check_null(this._textured_material,
            "textured material is null");
    }
    set textured_material(s) {
        this._textured_material = s;
    }

    get reflective_material() {
        return this.check_null(this._reflective_material,
            "reflective material is null");
    }
    set reflective_material(s) {
        this._reflective_material = s;
    }

    get texture_cube() {
        return this.check_null(this._texture_cube,
            "texture cube is null");
    }
    set texture_cube(s) {
        this._texture_cube = s;
    }

    get diffuse_color() {
        return this.check_null(this._diffuse_color,
            "diffuse color is null");
    }
    set diffuse_color(s) {
        this._diffuse_color = s;
    }

    get specular_color() {
        return this.check_null(this._specular_color,
            "specular color is null");
    }
    set specular_color(s) {
        this._specular_color = s;
    }
    get renderer() {
        return this.check_null(this._renderer,
            "renderer is null");
    }
    set renderer(s) {
        this._renderer = s;
    }

    get scene() {
        return this.check_null(this._scene,
            "scene is null");
    }
    set scene(s) {
        this._scene = s;
    }

    init_materials() {
        const materialColor = new THREE.Color();
        materialColor.setRGB(1.0, 1.0, 1.0);

        this.wire_material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            wireframe: true
        });

        this.flat_material = new THREE.MeshPhongMaterial({
            color: materialColor,
            specular: 0x000000,
            flatShading: true,
            side: THREE.DoubleSide
        });

        this.gouraud_material = new THREE.MeshLambertMaterial({
            color: materialColor,
            side: THREE.DoubleSide
        });

        this.phong_material = new THREE.MeshPhongMaterial({
            color: materialColor,
            side: THREE.DoubleSide
        });

        // this.textured_material = new THREE.MeshPhongMaterial({
        //     color: materialColor,
        //     map: textureMap,
        //     side: THREE.DoubleSide
        // });

        // this.reflective_material = new THREE.MeshPhongMaterial({
        //     color: materialColor,
        //     envMap: textureCube,
        //     side: THREE.DoubleSide
        // });
    }
    init_renderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.render_zone.appendChild(this.renderer.domElement);
    }
    init_camera() {
        // specify the camera with perspective projection
        const aspect_ratio = this.width / this.height;
        const fovy = 45;
        const near = 0.1;
        const far = 500;
        this.camera = new CameraWidget(0, 0, -20, this.width, this.height,
            fovy, near, far);
    }

    init_scene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xAAAAAA);

        this.scene.add(this.ambient_light);
        this.scene.add(this.light);
        this.scene.add(this.light_helper);
    }
    init_light() {
        this.ambient_light = new THREE.AmbientLight(0x333333); // 0.2

        this.light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        this.light_helper = new THREE.DirectionalLightHelper(this.light, 1);
    }
    init() {
        // set up camera
        this.init_camera();

        // set up lights
        this.init_light();

        // set up the renderer
        this.init_renderer();

        // camera controls
        this.camera_controller = new OrbitControls(this.camera.view, this.renderer.domElement);
        this.render_scene = this.render_scene.bind(this);
        this.camera_controller.addEventListener("change", this.render_scene);

        // MATERIALS
        this.init_materials();
        // init scene
        this.init_scene();
        // GUI
        this.setup_gui();
    }

    set_effect_controller() {

        this.effect_controller = {
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
            newShading: "flat",
            //
            far: this.camera.model.far,
            near: this.camera.model.near,
            fovy: this.camera.model.fov,
            camera_pos_x: this.camera.model.x,
            camera_pos_y: this.camera.model.y,
            camera_pos_z: this.camera.model.z
        };
    }

    create_new_cube() {
        if (this._cube !== null) {

            this._cube.geometry.dispose();
            this.scene.remove(this._cube);
        }
        const cubeGeometry = new THREE.BoxGeometry(this.cube_width, this.cube_height,
            this.cube_depth);
        let mat;
        if (this.shading === "wireframe") {
            mat = this.wire_material;
        } else if (this.shading === "flat") {
            mat = this.flat_material;
        } else if (this.shading === "smooth") {
            mat = this.gouraud_material;
        } else if (this.shading === "glossy") {
            mat = this.phong_material;
        } else if (this.shading === "textured") {
            mat = this.textured_material;
        } else {
            mat = this.reflective_material;
        }
        this._cube = new THREE.Mesh(
            cubeGeometry,
            mat
        ); // if no match, pick Phong

        this.scene.add(this.cube);
    }

    update_cube() {
        if (this.effect_controller.width !== this.cube_width ||
            this.effect_controller.height !== this.cube_height ||
            this.effect_controller.depth !== this.cube_depth ||
            this.effect_controller.newShading !== this.shading) {

            this.cube_width = this.effect_controller.width;
            this.cube_height = this.effect_controller.height;
            this.cube_depth = this.effect_controller.depth;
            this.shading = this.effect_controller.newShading;

            this.create_new_cube();

        }
    }
    render_scene() {
        this.update_cube();
        // this.update_camera();

        // We're a bit lazy here. We could check to see if any material attributes changed and update
        // only if they have. But, these calls are cheap enough and this is just a demo.
        this.phong_material.shininess = this.effect_controller.shininess;

        // texturedMaterial.shininess = this.effect_controller.shininess;

        this.diffuse_color.setHSL(this.effect_controller.hue,
            this.effect_controller.saturation, this.effect_controller.lightness);
        if (this.effect_controller.metallic) {

            // make colors match to give a more metallic look
            this.specular_color.copy(this.diffuse_color);

        } else {
            // more of a plastic look
            this.specular_color.setRGB(1, 1, 1);
        }

        this.diffuse_color.multiplyScalar(this.effect_controller.kd);
        this.flat_material.color.copy(this.diffuse_color);
        this.gouraud_material.color.copy(this.diffuse_color);
        this.phong_material.color.copy(this.diffuse_color);
        // texturedMaterial.color.copy(diffuseColor);

        this.specular_color.multiplyScalar(this.effect_controller.ks);
        this.phong_material.specular.copy(this.specular_color);
        // texturedMaterial.specular.copy(specularColor);

        // Ambient's actually controlled by the light for this demo
        this.ambient_light.color.setHSL(this.effect_controller.hue,
            this.effect_controller.saturation,
            this.effect_controller.lightness * this.effect_controller.ka);


        this.light.position.set(this.effect_controller.lx,
            this.effect_controller.ly, this.effect_controller.lz);
        this.light.color.setHSL(this.effect_controller.lhue,
            this.effect_controller.lsaturation, this.effect_controller.llightness);

        // skybox is rendered separately, so that it is always behind the teapot.
        if (this.shading === "reflective") {

            this.scene.background = this.texture_cube;

        } else {

            this.scene.background = null;
        }

        // update camera

        this.renderer.render(this.scene, this.camera.view);
    }

    set_material_coeff_menu(container, gui) {

        container = gui.addFolder("Material control");

        container.add(this.effect_controller, "shininess", 1.0, 400.0,
            1.0).name("shininess").onChange(this.render_scene);
        container.add(this.effect_controller, "kd", 0.0, 1.0,
            0.025).name("diffuse strength").onChange(this.render_scene);
        container.add(this.effect_controller, "ks", 0.0, 1.0,
            0.025).name("specular strength").onChange(this.render_scene);
        container.add(this.effect_controller,
            "metallic").onChange(this.render_scene);
    }

    /**
    set material color menu
    */
    set_material_color_menu(container, gui) {
        container = gui.addFolder("Material color");

        container.add(this.effect_controller, "hue", 0.0, 1.0,
            0.025).name("hue").onChange(this.render_scene);
        container.add(this.effect_controller, "saturation", 0.0, 1.0,
            0.025).name("saturation").onChange(this.render_scene);
        container.add(this.effect_controller, "lightness", 0.0, 1.0,
            0.025).name("lightness").onChange(this.render_scene);
    }

    set_light_menu(container, gui) {
        container = gui.addFolder("Lighting");

        container.add(this.effect_controller, "lhue", 0.0, 1.0,
            0.025).name("hue").onChange(this.render_scene);
        container.add(this.effect_controller, "lsaturation", 0.0, 1.0,
            0.025).name("saturation").onChange(this.render_scene);
        container.add(this.effect_controller, "llightness", 0.0, 1.0,
            0.025).name("lightness").onChange(this.render_scene);
        container.add(this.effect_controller, "ka", 0.0, 1.0,
            0.025).name("ambient").onChange(this.render_scene);

        // light (directional)

        container = gui.addFolder("Light direction");

        container.add(this.effect_controller, "lx", -1.0, 1.0,
            0.025).name("x").onChange(this.render_scene);
        container.add(this.effect_controller, "ly", -1.0, 1.0,
            0.025).name("y").onChange(this.render_scene);
        container.add(this.effect_controller, "lz", -1.0, 1.0,
            0.025).name("z").onChange(this.render_scene);
    }

    set_mesh_geometry_control_menu(container, gui) {
        container = gui.addFolder("Geometry control");
        container.add(this.effect_controller, "width", 1.0, 100.0,
            1.0).name("cube width").onChange(this.render_scene);
        container.add(this.effect_controller, "height", 1.0, 100.0,
            1.0).name("cube height").onChange(this.render_scene);
        container.add(this.effect_controller, "depth", 1.0, 100.0,
            1.0).name("cube depth").onChange(this.render_scene);
    }
    set_camera_control_menu(container, gui) {

        container = gui.addFolder("Camera Control");
        container.add(this.effect_controller, "far", 1.0, 500.0,
            1.0).name("far plane distance").onChange(this.render_scene);
        container.add(this.effect_controller, "near", 0.001, 0.1,
            0.001).name("near plane distance").onChange(this.render_scene);

        //
        // container.add(this.effect_controller, "fovy", 1, 120,
        //     1).name("field of view").onChange(this.render_scene);

        //
        container.add(this.effect_controller, "camera_pos_x", -this.width, this.width,
            1.0).name("cam x").onChange(this.render_scene);
        container.add(this.effect_controller, "camera_pos_y", -this.height, this.height,
            1.0).name("cam y").onChange(this.render_scene);
        container.add(this.effect_controller, "camera_pos_z",
            -this.effect_controller.far,
            this.effect_controller.far, 1.0).name("cam z").onChange(this.render_scene);
    }

    setup_gui() {
        this.set_effect_controller();

        const gui = new GUI();

        let container;

        // material attributes
        this.set_material_coeff_menu(container, gui);

        // material (color)
        this.set_material_color_menu(container, gui);

        // set light menu
        this.set_light_menu(container, gui);

        // mesh geometry control menu
        this.set_mesh_geometry_control_menu(container, gui);

        // camera control menu
        // this.set_camera_control_menu(container, gui);

        // shading

        gui.add(this.effect_controller,
            "newShading", ["wireframe", "flat",
                "smooth",
                "glossy"
                //"textured", "reflective"
            ]).name("Shading").onChange(this.render_scene);
    }
}
export {
    CubeScene
};
