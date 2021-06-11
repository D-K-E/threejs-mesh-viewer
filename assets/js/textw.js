// text area js

class TextPartModel {
    constructor(index = null,
        editable = null,
        light_info = null,
        text = null) {
        this._index = index;
        this._is_editable = editable;
        this._light_info = light_info;
        this._text = text;
    }
    get index() {
        if (this._index === null) {
            throw "index is null";
        }
        return this._index;
    }
    get text() {
        if (this._text === null) {
            throw "text is null";
        }
        return this._text;
    }
    set text(t) {
        this._text = t;
    }
    set index(i) {
        this._index = i;
    }
    get is_editable() {
        if (this._is_editable === null) {
            throw "text is null";
        }
        return this._is_editable;
    }
    set is_editable(s) {
        this._is_editable = s;
    }
    get light_info() {
        if (this._light_info === null) {
            throw "light info is null";
        }
        return this._light_info;
    }
    set light_info(s) {
        this._light_info = s;
    }
    static from_html_is_editable(model, el) {
        let rbtn = el.getElementById("text-part-radio-" + model.index +
            "editable");
        model.is_editable = rbtn.checked;
        return model;
    }
    static from_html_text(model, el) {
        let rbtn = el.getElementById("text-part-" + model.index);
        model.text = rbtn.text;
        return model;
    }
    static from_html_light_info(model, el) {
        let xdir = el.getElementById("x-light-direction-" + model.index);
        let ydir = el.getElementById("y-light-direction-" + model.index);
        let zdir = el.getElementById("z-light-direction-" + model.index);
        let rc = el.getElementById("r-light-color-" + model.index);
        let gc = el.getElementById("g-light-color-" + model.index);
        let bc = el.getElementById("b-light-color-" + model.index);
        let linfo = {
            "direction": {
                x: xdir,
                y: ydir,
                z: zdir
            },
            "color": {
                r: rc,
                g: gc,
                b: bc
            }
        }
        model.light_info = linfo;
        return model;
    }
    static from_html(index, el) {
        let model = new TextPartModel(index);
        //
        model = TextPartModel.from_html_is_editable(model, el);
        model = TextPartModel.from_html_light_info(model, el);
        model = TextPartModel.from_html_text(model, el);
        return model;
    }
}

class TextPartView {
    constructor(model = null) {
        this._model = model;
        this.name = "text-part";
    }
    get model() {
        if (this._model === null) {
            throw "model is null";
        }
        return this._model;
    }
    mk_radio_btn(is_editable) {
        let editable = document.createElement("input");
        editable.type = "radio";
        if (is_editable) {
            editable.id = this.name + "-radio-" + this.model.index + "-editable";
        } else {
            editable.id = this.name + "-radio-" + this.model.index + "-not-editable";
        }
        editable.name = this.name + "-radio-" + this.model.index + "-name";
        if (is_editable) {
            editable.value = "not-editable";
            editable.checked = this.model.is_editable;
        } else {
            editable.value = "not-editable";
            editable.checked = !this.model.is_editable;
        }
        return editable;
    }
    mk_radio() {
        // create editable radio button
        let editable = this.mk_radio_btn(true);
        // create editable radio button label
        let elabel = document.createElement("label");
        elabel.htmlFor = editable.id;
        elabel.appendChild(document.createTextNode("Editable"));
        // create line break
        let br = document.createElement("br");
        // create non editable radio button
        let non_edit = this.mk_radio_btn(false);
        // create non editable radio button label
        let e_nlabel = document.createElement("label");
        e_nlabel.htmlFor = non_edit.id;
        e_nlabel.appendChild(document.createTextNode("Not Editable"));

        // container
        let div = document.createElement("div");
        div.id = "text-part-switch-" + this.model.index;
        div.appendChild(editable);
        div.appendChild(elabel);
        div.appendChild(br);
        div.appendChild(non_edit);
        div.appendChild(e_nlabel);
        return div
    }
    mk_light_dir() {
        let plight_dir = document.createElement("p");
        plight_dir.id = "light-direction-info-" + this.model.index;
        // xval
        let xval = document.createElement("span");
        xval.textNode = "x: " + this.model.light_info["direction"].x;
        xval.id = "x-light-direction-" + this.model.index;
        let yval = document.createElement("span");
        yval.id = "y-light-direction-" + this.model.index;
        yval.textNode = " y: " + this.model.light_info["direction"].y;
        let zval = document.createElement("span");
        zval.textNode = " z: " + this.model.light_info["direction"].z;
        zval.id = "z-light-direction-" + this.model.index;
        plight_dir.appendChild(document.createTextNode("Light Direction: "));
        plight_dir.appendChild(xval);
        plight_dir.appendChild(yval);
        plight_dir.appendChild(zval);
        return plight_dir;
    }
    mk_light_color() {
        let plight_color = document.createElement("p");
        plight_color.id = "light-color-info-" + this.model.index;
        // xval
        let xvalc = document.createElement("span");
        xvalc.textNode = "r: " + this.model.light_info["color"].r;
        xvalc.id = "r-light-color-" + this.model.index;
        let yvalc = document.createElement("span");
        yvalc.textNode = " g: " + this.model.light_info["color"].g;
        yvalc.id = "g-light-color-" + this.model.index;
        let zvalc = document.createElement("span");
        zvalc.textNode = " b: " + this.model.light_info["color"].b;
        zvalc.id = "b-light-color-" + this.model.index;
        plight_color.appendChild(document.createTextNode("Light Color: "));
        plight_color.appendChild(xvalc);
        plight_color.appendChild(yvalc);
        plight_color.appendChild(zvalc);
        return plight_color;
    }
    mk_light_info() {
        let plight_dir = this.mk_light_dir();
        // light color
        let plight_color = this.mk_light_color();
        //
        let div = document.createElement("div");
        div.id = "text-light-info-" + this.model.index;
        div.appendChild(plight_dir);
        div.appendChild(plight_color);
        return div;
    }
    mk_text_part() {
        let tpart = document.createElement("textarea");
        tpart.id = "text-part-" + this.model.index;
        tpart.readOnly = true;
        tpart.text = this.model.text;
        return tpart;
    }
    to_html() {
        let tpart = this.mk_text_part();
        let light_info = this.mk_light_info();
        let radios = this.mk_radio();
        //
        let li = document.createElement("li");
        li.id = "text-part-container-" + this.model.index;
        li.appendChild(radios);
        li.appendChild(light_info);
        li.appendChild(tpart);
        return li;
    }
    to_json() {
        let jd = {};
        jd["light_info"] = this.model.light_info;
        jd["text"] = this.model.text;
        jd["index"] = this.model.index;
        return jd;
    }
}
class TextPartControl {
    constructor(model = null, view = null) {
        this._model = model;
        this._view = view;
    }
    get model() {
        if (this._model === null) {
            throw "model is null";
        }
        return this._model;
    }
    get view() {
        if (this._view === null) {
            throw "view is null";
        }
        return this._view;
    }
    update_from_html(el) {
        let index = this.model.index;
        let nmodel = TextPartModel.from_html(index, el);
        this.view = new TextPartView(nmodel);
        this.model = nmodel;
    }
    static from_html(index, el) {
        let model = TextPartModel.from_html(index, el);
        let view = new TextPartView(model);
        return new TextPartControl(model, view);
    }
    to_html() {
        return this.view.to_html();
    }

    change_light_info(x, y, z, vs, is_dir) {
        if (this.model.is_editable) {
            let vals = []
            let middle;
            if (is_dir) {
                middle = "direction";
            } else {
                middle = "color";
            }
            for (const key in vs) {
                vals.push({
                    k: key,
                    v: vs[key],
                    id: key + "-light-" + middle + "-" + this.model.index
                });
            }
            for (const key in vals) {
                let id = vals[key].id;
                let val = vals[key].v;
                let t = document.getElementById(id);
                if (t.firstChild) {
                    t.removeChild(t.firstChild);
                }
                let txt = " " + vals[key].k + ": " + val;
                t.appendChild(document.createTextNode(txt));
            }
        }
    }
    change_light_direction(x, y, z) {
        let vs = {
            x: x,
            y: y,
            z: z
        };
        this.change_light_info(x, y, z, vs, true);
    }
    change_light_color(x, y, z) {
        let vs = {
            r: x,
            g: y,
            b: z
        };
        this.change_light_info(x, y, z, vs, false);
    }
    change_text(txt) {
        if (this.model.is_editable) {
            this.model.text = txt;
        }
    }
    change_editable(is_editable) {
        this.model.is_editable = is_editable;
        let tarea = document.getElementById("text-part-" + this.model.index);
        tarea.readOnly = !is_editable;
    }
}
class TextPartWidget {
    constructor() {
        this.text_parts = [];
        this.id = "text-parts";
        this.new_text_part();
    }
    add_to_text_part(index) {
        let linfo = {
            "direction": {
                "x": null,
                "y": null,
                "z": null
            },
            "color": {
                "r": null,
                "g": null,
                "b": null
            }
        };
        let model = new TextPartModel(index, false, linfo, "")
        let view = new TextPartView(model);
        let control = new TextPartControl(model, view);
        this.text_parts.push(control);
        this.to_html();
    }
    new_text_part() {
        this.add_to_text_part(this.text_parts.length);
    }
    add_text_editable_event(index) {
        let tid = this.text_parts[index].model.index;
        let tarea = document.getElementById("text-part-" + tid);
        let rid1 = "text-part-radio-" + tid + "-editable";
        let rid2 = "text-part-radio-" + tid + "-not-editable";
        tarea.addEventListener("change", (e) => {
            this.change_text_event(e);
        });
        let rbtn1 = document.getElementById(rid1);
        rbtn1.addEventListener("change", (e) => {
            this.change_editable_event(e)
        });
        let rbtn2 = document.getElementById(rid2);
        // rbtn2.addEventListener("change", this.change_editable_event);
        rbtn2.addEventListener("change", (e) => {
            this.change_editable_event(e);
        });

    }
    change_text_event(e) {
        // change text event handle
        let target = e.target;
        let str = "text-part-";
        let id = target.id;
        let idnb = id.slice(str.length);
        let tpart = this.text_parts[parseInt(idnb)];
        tpart.model.text = target.text;
    }
    change_editable_event(e) {
        let target = e.target;
        let sid = target.id;
        let start = sid.indexOf("not-editable");
        let rstr = "text-part-radio-";
        let check = false;
        let index = null;
        if (start === -1) {
            // editable radio button
            if (target.checked === true) {
                check = target.checked === true;
            }
            let sindex = sid.indexOf("-editable");
            let index_str = target.id.slice(rstr.length, sindex);
            index = parseInt(index_str);
        } else {
            // not editable radio button
            if (target.checked) {
                check = target.checked === false;
            }
            //
            let sindex = sid.indexOf("-not-editable");
            let index_str = target.id.slice(rstr.length, sindex);
            index = parseInt(index_str);
        }
        this.text_parts[index].change_editable(check);
    }
    get_editables() {
        let parts = [];
        for (const k in this.text_parts) {
            if (this.text_parts[k].model.is_editable) {
                parts.push(k);
            }
        }
        return parts;
    }
    change_light_direction(x, y, z) {
        let eds = this.get_editables();
        for (var i = 0; i < eds.length; i++) {
            this.text_parts[eds[i]].change_light_direction(x, y, z);
        }
    }
    change_light_color(x, y, z) {
        let eds = this.get_editables();
        for (var i = 0; i < eds.length; i++) {
            this.text_parts[eds[i]].change_light_color(x, y, z);
        }
    }
    to_html() {
        let ul = document.getElementById(this.id);
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        for (const k in this.text_parts) {
            ul.appendChild(this.text_parts[k].to_html());
        }
    }
}
export {
    TextPartWidget
}
