// basic object
import {
    OrbitControls,
    THREE,
    GLTFLoader,
    RGBELoader,
    RoughnessMipmapper,
    OBJLoader,
    GUI
} from "./external.js";


class BaseWidget {
    constructor(model = null, view = null) {
        this._model = model;
        this._view = view;
    }
    check_null(obj, message) {
        if (obj === null) {
            throw message;
        }
        return obj;
    }
    get model() {
        return this.check_null(this._model, "model is null");
    }
    set model(m) {
        if (typeof(m) === "object") {
            this._model = m;
        }
    }
    get view() {
        return this.check_null(this._view, "model is null");
    }
    set view(v) {
        if (typeof v === "object") {
            this._view = v;
        }
    }
}

class CameraWidget extends BaseWidget {
    constructor(camera_pos_x,
        camera_pos_y, camera_pos_z, scene_width, scene_height,
        fovy, near, far) {
        const aspect_ratio = scene_width / scene_height;
        let model = {
            x: camera_pos_x,
            y: camera_pos_y,
            z: camera_pos_z,
            scene_width: scene_width,
            scene_height: scene_height,
            aspect_ratio: aspect_ratio,
            fovy: fovy,
            near: near,
            far: far
        };
        const camera = new THREE.PerspectiveCamera(fovy, aspect_ratio, near, far);
        camera.position.set(model.x, model.y, model.z);
        let view = camera;
        super(model, view);
    }
    update() {
        let camera = this.view;
        camera.position.set(this.model.x, this.model.y, this.model.z);
        camera.far = this.model.far;
        camera.near = this.model.near;
        camera.aspect = this.model.aspect_ratio;
        this.view = camera;
    }
    set_model(model) {
        for (const key in model) {
            if (!this.model.hasOwnProperty(key)) {
                throw "model has unexpected key " + key;
            }
        }
        this.model = model;
        this.update();
    }
    move_z(amount) {
        this.model.z = amount;
        this.update();
    }
    move_x(amount) {
        this.model.x = amount;
        this.update();
    }
    move_y(amount) {
        this.model.y = amount;
        this.update();
    }
    set_far(amount) {
        this.model.far = amount;
        this.update();
    }
    set_near(amount) {
        this.model.near = amount;
        this.update();
    }
    set_fovy(amount) {
        this.model.fovy = amount;
        this.update();
    }
    set_scene_width(amount) {
        this.model.scene_width = amount;
        this.model.aspect_ratio = this.model.scene_width /
            this.model.scene_height;
        this.update();
    }
    set_scene_height(amount) {
        this.model.scene_height = amount;
        this.model.aspect_ratio = this.model.scene_width /
            this.model.scene_height;
        this.update();
    }
}

export {
    BaseWidget,
    CameraWidget
};
