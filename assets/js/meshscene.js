// mesh scene
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

import {
    BaseScene,
    roundUp
} from "./basescene.js";

class MeshScene extends BaseScene {
    constructor(render_zone_id = "render-zone", mesh_url = null) {
        super(render_zone_id);
        this._mesh_url = mesh_url;

        this._effect_controller = null;


        this._mesh = null;

    }
    get mesh() {
        return this.check_null(this._mesh, "scene mesh is null");
    }
    set mesh(s) {
        this._mesh = s;
    }

    get mesh_url() {
        return this.check_null(this._mesh_url, "mesh url null");
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
        this.scene.add(this.mesh);
    }
    init_light() {
        this.ambient_light = new THREE.AmbientLight(0x333333); // 0.2

        this.light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        this.light_helper = new THREE.DirectionalLightHelper(this.light, 1);
    }
    init_mesh_obj() {
        const loader = new OBJLoader();
        const mesh = loader.load(
            this.mesh_url,
            (obj) => {
                this.mesh = obj;
                this.init_scene();
                this.render_scene();
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened: ' + error);
            }
        );
    }
    init_mesh_gltf() {
        const loader = new GLTFLoader();
        const mesh = loader.load(
            this.mesh_url,
            (gltf) => {
                this.mesh = gltf.scene;
                this.init_scene();
                this.render_scene();
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened: ' + error);
            }
        );

    }
    init_mesh() {
        let ext = this.mesh_url.split(".").pop();
        if (ext === "gltf") {
            this.init_mesh_gltf();
        } else if (ext === "obj") {
            this.init_mesh_obj();
        }
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

        // GUI
        this.setup_gui();

        // MATERIALS
        this.init_materials();

        // init mesh
        this.init_mesh();

        // init scene
        // this.init_scene();
    }

    set_effect_controller() {

        this.effect_controller = {
            shininess: 40.0,
            ka: 0.17,
            kd: 0.51,
            ks: 0.2,
            metallic: true,

            r: 0.121,
            g: 0.73,
            b: 0.66,

            lr: 0.04,
            lg: 0.01, // non-zero so that fractions will be shown
            lb: 1.0,

            // bizarrely, if you initialize these with negative numbers, the sliders
            // will not show any decimal places.
            lx: 0.32,
            ly: 0.39,
            lz: 0.7,
            scale_x: 1.0,
            scale_y: 1.0,
            scale_z: 1.0,
            rotate_axis_x: 1.0,
            rotate_axis_y: 1.0,
            rotate_axis_z: 1.0,
            rotate_angle: 0,
            translate_x: 0,
            translate_y: 0,
            translate_z: 0,
            apply_tfn: false,
            newShading: "flat",
            //
        };
    }

    update_mesh() {
        const should_apply = this.effect_controller.apply_tfn;
        if (should_apply) {
            //
            const s_x = this.effect_controller.scale_x;
            const s_y = this.effect_controller.scale_y;
            const s_z = this.effect_controller.scale_z;
            //
            const r_x = this.effect_controller.rotate_axis_x;
            const r_y = this.effect_controller.rotate_axis_y;
            const r_z = this.effect_controller.rotate_axis_z;
            //
            const m_x = this.effect_controller.translate_x;
            const m_y = this.effect_controller.translate_y;
            const m_z = this.effect_controller.translate_z;

            // rotation angle
            let rotation_degree = this.effect_controller.rotate_angle;
            rotation_degree /= (2 * Math.PI);

            // translate -> rotate -> scale
            let matrix = new THREE.Matrix4();

            //
            let rotation_vec = new THREE.Vector3(r_x, r_y, r_z);
            rotation_vec.normalize();
            //
            matrix = matrix.makeRotationAxis(rotation_vec, rotation_degree);
            matrix.setPosition(new THREE.Vector3(m_x, m_y, m_z));

            // translate -> rotation
            this.mesh.applyMatrix4(matrix);

            // scale
            let matrix2 = new THREE.Matrix4();
            matrix2 = matrix2.makeScale(s_x, s_y, s_z);
            //
            this.mesh.applyMatrix4(matrix2);

        }
    }
    render_scene() {
        // this.update_camera();

        // We're a bit lazy here. We could check to see if any material attributes changed and update
        // only if they have. But, these calls are cheap enough and this is just a demo.
        this.phong_material.shininess = this.effect_controller.shininess;

        // texturedMaterial.shininess = this.effect_controller.shininess;

        this.diffuse_color.setRGB(this.effect_controller.r,
            this.effect_controller.g, this.effect_controller.b);
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
        this.ambient_light.color.setRGB(this.effect_controller.r,
            this.effect_controller.g,
            this.effect_controller.b * this.effect_controller.ka);

        //
        let lx, ly, lz, lg, lr, lb;
        lx = this.effect_controller.lx;
        ly = this.effect_controller.ly;
        lz = this.effect_controller.lz;
        lr = this.effect_controller.lr;
        lg = this.effect_controller.lg;
        lb = this.effect_controller.lb;

        this.light.position.set(lx, ly, lz);
        this.light.color.setRGB(lr, lg, lb);

        this.text_w.change_light_direction(
            roundUp(lx, 3),
            roundUp(ly, 3),
            roundUp(lz, 3)
        );
        this.text_w.change_light_color(
            roundUp(lr, 3), roundUp(lg, 3), roundUp(lb, 3)
        );

        this.shading = this.effect_controller.newShading;


        // update mesh
        this.update_mesh();

        // skybox is rendered separately, so that it is always behind the teapot.
        if (this.shading === "reflective") {

            this.scene.background = this.texture_cube;

        } else {

            this.scene.background = null;
        }

        // update camera

        this.renderer.render(this.scene, this.camera.view);
    }

    set_material_coeff_menu(container) {

        container = this.gui.addFolder("Material control");

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
    set_material_color_menu(container) {
        container = this.gui.addFolder("Material color");

        container.add(this.effect_controller, "r", 0.0, 1.0,
            0.025).name("r").onChange(this.render_scene);
        container.add(this.effect_controller, "g", 0.0, 1.0,
            0.025).name("g").onChange(this.render_scene);
        container.add(this.effect_controller, "b", 0.0, 1.0,
            0.025).name("b").onChange(this.render_scene);
    }

    set_light_menu(container) {
        container = this.gui.addFolder("Lighting");

        container.add(this.effect_controller, "lr", 0.0, 1.0,
            0.025).name("r").onChange(this.render_scene);
        container.add(this.effect_controller, "lg", 0.0, 1.0,
            0.025).name("g").onChange(this.render_scene);
        container.add(this.effect_controller, "lb", 0.0, 1.0,
            0.025).name("b").onChange(this.render_scene);
        container.add(this.effect_controller, "ka", 0.0, 1.0,
            0.025).name("ambient").onChange(this.render_scene);

        // light (directional)

        container = this.gui.addFolder("Light direction");

        container.add(this.effect_controller, "lx", -1.0, 1.0,
            0.025).name("x").onChange(this.render_scene);
        container.add(this.effect_controller, "ly", -1.0, 1.0,
            0.025).name("y").onChange(this.render_scene);
        container.add(this.effect_controller, "lz", -1.0, 1.0,
            0.025).name("z").onChange(this.render_scene);
    }

    set_mesh_geometry_control_menu(container, gui) {
        container = this.gui.addFolder("Geometry control");
        container.add(this.effect_controller, "scale_x", 0.1, 2.0,
            0.1).name("scale x");
        container.add(this.effect_controller, "scale_y", 0.1, 2.0,
            0.1).name("scale y");
        container.add(this.effect_controller, "scale_z", 0.1, 2.0,
            0.1).name("scale z");

        container.add(this.effect_controller, "rotate_axis_x", 0.0, 1.0,
            0.1).name("rotation axis x");

        container.add(this.effect_controller, "rotate_axis_y", 0.0, 1.0,
            0.1).name("rotation axis y");

        container.add(this.effect_controller, "rotate_axis_z", 0.0, 1.0,
            0.1).name("rotation axis z");

        container.add(this.effect_controller, "rotate_angle", 0.0, 360.0,
            1.0).name("rotation angle");

        container.add(this.effect_controller, "translate_x", -10.0, 10.0,
            1.0).name("translate x");
        container.add(this.effect_controller, "translate_y", -10.0, 10.0,
            1.0).name("translate y");
        container.add(this.effect_controller, "translate_z", -10, 10.0,
            1.0).name("translate z");
        container.add(this.effect_controller, "apply_tfn",
            false).name("should apply");
        var obj = {
            apply: () => {
                console.log("applied transformation")
            }
        }
        container.add(obj, "apply").name("apply").onChange(this.render_scene);
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

        this._gui = new GUI();

        let container;

        // material attributes
        this.set_material_coeff_menu(container);

        // material (color)
        this.set_material_color_menu(container);

        // set light menu
        this.set_light_menu(container);

        // mesh geometry control menu
        this.set_mesh_geometry_control_menu(container);

        // camera control menu
        // this.set_camera_control_menu(container, gui);

        // shading

        this.gui.add(this.effect_controller,
            "newShading", ["wireframe", "flat",
                "smooth",
                "glossy"
                //"textured", "reflective"
            ]).name("Shading").onChange(this.render_scene);
    }
    clear() {
        this.scene.clear();
        this.gui.destroy();
    }

}

export {
    MeshScene
};
