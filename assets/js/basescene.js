// object grouping common scene elements like gui etc
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


class BaseScene {
    constructor(render_zone_id = "render-zone") {
        this._render_zone = document.getElementById(render_zone_id);
        this._width = this.render_zone.width;
        this._height = this.render_zone.height;
        this._camera = null;
        this._scene = null;
        this._renderer = null;

        // camera related
        this._camera_pos_x = null;
        this._camera_pos_y = null;
        this._camera_pos_z = null;

        // controllers
        this._camera_controller = null;
        this._effect_controller = null;

        // lights
        this._ambient_light = null;
        this._light = null;
        this._light_helper = null;

        // colors
        this._diffuse_color = new THREE.Color();
        this._specular_color = new THREE.Color();

        // materials
        this._shading = null;
        this._wire_material = null;
        this._flat_material = null;
        this._gouraud_material = null;
        this._phong_material = null;
        this._textured_material = null;
        this._reflective_material = null;

        // other textures etc
        this._texture_cube = null;


        // gui elements
        this._gui = null;

        this._text_parts = null;
    }
    check_null(obj, message) {
        if (obj === null) {
            throw message;
        }
        return obj;
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

    get gui() {
        return this.check_null(this._gui, "gui is null");
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
}
export {
    BaseScene
};
