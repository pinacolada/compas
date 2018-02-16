"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const display_1 = require("./display");
/**
 * Restreint une valeur entre deux limites
 * @param val valeur en cours
 * @param min valeur plancher
 * @param max valeur plafond
 */
function between(val, min, max) {
    if (val < min)
        return min;
    if (val > max)
        return max;
    return val;
}
exports.between = between;
/**
 * Convertit une couleur HSL en RGB.
 * h, s, et l sont compris dans l'intervalle [0, 1] et
 * renvoie r, g, and b dans l'intervalle [0,255].
 *
 * @param   {number}  h       hue
 * @param   {number}  s       saturation
 * @param   {number}  l       lightness
 * @return  {Array}           la représentation RGB
 */
function hslToRgb(h, s, l) {
    let r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    }
    else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
exports.hslToRgb = hslToRgb;
/**
 * Convertit une couleur RGB en HSL
 * Les valeurs r, g, et b sont contenue dans l'intervalle [0, 255] et
 * les valeurs h, s, et l renvoyés sont comprises dans l'intervalle [0, 1].
 *
 * @param   {number}  r       valeur du rouge
 * @param   {number}  g       valeur du vert
 * @param   {number}  b       valeur du blue
 * @return  {Array}           Représentation HSL de la couleur
 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    }
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}
exports.rgbToHsl = rgbToHsl;
/**
 * Convertit une valeur en pourcentage
 * @param val valeur à convertir en pourcentage
 * @param min valeur plancher
 * @param max valeur plafond
 * @return  {number} le pourcentage représenté
 */
function percent(val, min, max) {
    return (val - min) / (max - min);
}
exports.percent = percent;
/**
 * Convertit un pourcentage en valeur numérique
 * @param pct pourcentage à convertir en valeur
 * @param min valeur plancher
 * @param max valeur plafond
 * @return {number} la valeur représentée
 */
function valueOf(pct, min, max) {
    return Math.floor(((max - min) * pct) + min);
}
exports.valueOf = valueOf;
/**
 * Zone active rectangulaire
 */
class Box extends display_1.Sprite {
    /**
     * Sprite coloré rectangulaire
     * @param id identifiant
     * @param target support
     * @param px position horizontale
     * @param py position verticale
     * @param w largeur
     * @param h hauteur
     * @param bgColor couleur du fond
     * @param bdrColor couleur de la bordure
     * @param bdrStyle style de bordure
     * @param bdrRadius arrondi des coins
     */
    constructor(id, target, px, py, w, h, bgColor, bdrColor = 0xFFFFFF, bdrStyle = "outset", bdrRadius = 0) {
        super();
        this.name = id;
        target.addChild(this);
        this.setRect(px, py, w, h);
        this.backgroundColor = bgColor;
        this.setBorder(2, bdrColor, 1.0, bdrStyle, bdrRadius);
    }
}
exports.Box = Box;
/**
 * Zone d'affichage de texte non interactif
 */
class Label extends display_1.TextField {
    /**
     * Zone d'affichage de texte non interactif
     * @param id identifiant
     * @param target support
     * @param px position horizontale
     * @param py position verticale
     * @param w largeur
     * @param h hauteur
     */
    constructor(id, target, px, py, w, h) {
        super();
        this.name = id;
        target.addChild(this);
        this.setRect(px, py, w, h);
        this.mouseEnabled = false;
        this.selectable = false;
        this.defaultTextFormat = new display_1.TextFormat("verdana", 10, 0xFFFFFF, false, false, false, "center", 0, 0, 1);
    }
}
exports.Label = Label;
/**
 * Elément d'interface permettant d'effectuer un réglage numérique
 */
class Slider extends Box {
    /**
     * Réglette horizontale affichant une valeur d'échelle (entre 0 et 100%)
     * @param id identifiant du slider
     * @param target support
     * @param px position horizontale
     * @param py position verticale
     * @param w largeur
     * @param current valeur en cours
     * @param min valeur plancher
     * @param max valeur plafond
     * @param bViewPCent afficher la valeur en pourcentage ?
     */
    constructor(id, target, px, py, w, current, min = 0, max = 100, bViewPCent = false) {
        super(id, target, px, py, w, 25, 0xFFFFFF, 0xFFFFFF, "inset", 12);
        this.maxCurs = 0;
        /**
         * Pourcentage affecté au Slider, entre 0 et 1
         */
        this.pct = 0;
        this.min = 0;
        this.max = 0;
        this.label = new Label(id + "_lbl", target, px, py + 26, w, 22);
        this.curs = new Box("curs", this, 0, 0, 18, 20, 0xFFFFFF, 0xDDDDFF, "outset", 12);
        this.curs.mouseEnabled = false;
        this.curs.backgroundAlpha = 0.4;
        this.maxCurs = w - 22;
        this.viewPercent = bViewPCent;
        this.setValues(min, max, current);
        this.el.addEventListener("mousedown", startMove);
        this.cursor = "pointer";
        const sld = this, curs = this.curs, stage = sld.stage;
        this.el.addEventListener("mousewheel", (e) => {
            sld.pct = between(e.wheelDelta > 0 ? sld.pct + 0.01 : sld.pct - 0.01, 0, 1);
            sld.show();
            sld.dispatch("change");
        });
        function startMove(e) {
            if (stage == null)
                return;
            stage.el.addEventListener("mousemove", move);
            stage.el.addEventListener("mouseup", stopMove);
            move(e);
        }
        function stopMove(e) {
            if (stage == null)
                return;
            stage.el.removeEventListener("mousemove", move);
            stage.el.removeEventListener("mouseup", stopMove);
        }
        function move(e) {
            let pos = between(sld.mouseX - 10, 1, sld.maxCurs);
            sld.pct = percent(pos, 1, sld.maxCurs);
            sld.show();
            sld.dispatch("change");
        }
    }
    /**
     * Définit ou modifie la valeur affichée et ses bornes
     * @param min valeur plancher
     * @param max valeur plafond
     * @param current valeur en cours
     */
    setValues(min, max, current) {
        this.min = min;
        this.max = max;
        this.currentVal = current;
    }
    /**
     * Définit la position du curseur et le texte de l'étiquette
     * en fonction du % à afficher
     */
    show() {
        this.curs.x = valueOf(this.pct, 1, this.maxCurs);
        this.label.text = this.name + ": " + (this.viewPercent ?
            this.pCentT : valueOf(this.pct, this.min, this.max).toString());
    }
    /**
     * Valeur textuelle du pourcentage
     */
    get pCentT() {
        return (this.pct * 100).toFixed(0) + "%";
    }
    /**
     * Valeur numérique représentée par le slider
     */
    get currentVal() {
        return valueOf(this.pct, this.min, this.max);
    }
    set currentVal(val) {
        this.pct = percent(val, this.min, this.max);
        this.show();
    }
}
exports.Slider = Slider;
class ColorPicker extends Box {
    /**
     * Sélecteur de couleur générique
     * @param id identifiant du sélecteur
     * @param target support du sélecteur
     * @param px position horizontale
     * @param py position verticale
     * @param current couleur à afficher au lancement
     * @param callbk réaction au changement de sélection
     */
    constructor(id, target, px, py, current, callbk) {
        super(id, target, px, py, 250, 180, 0x666666, 0xFFFFFF, "outset", 4);
        this.info = new Label("info", this, 34, 3, 220, 20);
        this.view = new Box("view", this, 3, 3, 30, 20, current, 0x999999, "inset", 0);
        this.view.cursor = "pointer";
        this.view.addListener("click", (b, e) => this.toggleFold(this, b));
        this.color = current;
        this.callback = callbk;
    }
    /**
     *  Replie ou déplie le sélecteur quand on clique sur la couleur
     * @param palette sélecteur
     * @param view zone d'affichage de la couleur
     */
    toggleFold(palette, view) {
        if (palette.width > 50) {
            palette.width = 40, palette.height = 30;
            palette.toBack();
        }
        else {
            palette.width = 250, palette.height = 180;
            palette.toFront();
        }
    }
}
exports.ColorPicker = ColorPicker;
class RGBColorPicker extends ColorPicker {
    /**
     * Sélecteur de couleur RGB (liste prédéfinie)
     * @param id identifiant du sélecteur
     * @param target support du sélecteur
     * @param px position horizontale
     * @param py position verticale
     * @param current couleur à afficher au lancement
     * @param callbk réaction au changement de sélection
     */
    constructor(id, target, px, py, current, callbk) {
        super(id, target, px, py, current, callbk);
        const lg = 12, ht = 11, startX = 14, startY = 32, endX = 223;
        var t = "0369CF", c = "", px = startX, py = startY, r, g, b;
        let view = this.view, pal = this;
        for (r = 0; r < t.length; r++) {
            for (g = 0; g < t.length; g++) {
                for (b = 0; b < t.length; b++) {
                    c = "#" + t.charAt(r).repeat(2) + t.charAt(g).repeat(2) + t.charAt(b).repeat(2);
                    addColor(this.el, px, py, c);
                    px += lg;
                    if (px > endX) {
                        px = startX;
                        py += ht;
                    }
                }
            }
        }
        /**
         * Magnifier : loupe montrant par déplacement et couleur de fond la couleur choisie
         */
        let mag = new Box("mag", this, 100, 100, 24, 24, 0xFFFFFF, 0xFFFFFF, "outset", 12);
        mag.mouseEnabled = false;
        function addColor(el, x, y, c) {
            let d = document.createElement("div");
            d.style.backgroundColor = c;
            d.style.position = "absolute";
            d.style.left = px + "px";
            d.style.top = py + "px";
            d.style.width = "12px";
            d.style.height = "11px";
            d.id = c;
            d.style.cursor = "pointer";
            d.addEventListener("mouseover", e => {
                mag.x = x - 6;
                mag.y = y - 6;
                view.backgroundColor = parseInt("0x" + c.substr(1));
                pal.info.text = c;
                mag.backgroundColor = view.backgroundColor;
            });
            d.addEventListener("mouseout", e => {
                view.backgroundColor = pal.color;
                if (pal.sel) {
                    mag.x = parseInt(pal.sel.style.left) - 6;
                    mag.y = parseInt(pal.sel.style.top) - 6;
                    mag.css.backgroundColor = pal.sel.id;
                    pal.info.text = pal.sel.id;
                }
            });
            d.addEventListener("click", e => {
                pal.color = parseInt("0x" + c.substr(1));
                pal.toggleFold(pal, view);
                pal.sel = d;
                if (pal.callback)
                    pal.callback(pal);
            });
            el.appendChild(d);
        }
        this.toggleFold(this, this.view);
    }
}
exports.RGBColorPicker = RGBColorPicker;
class HSLColorPicker extends ColorPicker {
    /**
     * Sélecteur de couleurs HSL
     * @param id identifiant du sélecteur
     * @param target support du sélecteur
     * @param px position horizontale
     * @param py position verticale
     * @param current couleur à afficher au lancement
     * @param callbk réaction à la modification de valeur
     */
    constructor(id, target, px, py, current, callbk) {
        super(id, target, px, py, current, callbk);
        let h = rgbToHsl((current >> 16) & 0xFF, (current >> 8) & 0xFF, current & 0xFF);
        this.hue = new Slider("Hue", this, 10, 35, 210, h[0] * 360, 0, 360, false);
        const par6 = 255 / 6;
        this.hue.gradientBackground([0xFF0000, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0xFF00FF, 0xFF0000], [1, 1, 1, 1, 1, 1, 1], [0, par6, par6 * 2, par6 * 3, par6 * 4, par6 * 5, par6 * 6, 255], 90);
        this.sat = new Slider("Sat", this, 10, 80, 210, h[1], 0, 1, true);
        this.sat.gradientBackground([0x000000, 0xFFFFFF], [1, 1], [0, 255], 90);
        this.lum = new Slider("Lum", this, 10, 125, 210, h[2], 0, 1, true);
        this.lum.gradientBackground([0x000000, 0xFFFFFF], [1, 1], [0, 255], 90);
        this.hue.addListener("change", () => this.change());
        this.sat.addListener("change", () => this.change());
        this.lum.addListener("change", () => this.change());
        this.change();
        this.toggleFold(this, this.view);
        this.callback = callbk;
    }
    change() {
        this.view.css.backgroundColor = this.hsl;
        let rgb = hslToRgb(this.hue.pct, this.sat.pct, this.lum.pct);
        this.color = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
        this.info.text = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        if (this.callback)
            this.callback(this);
    }
    get hsl() {
        return "hsl(" + Math.floor(this.hue.pct * 360) + "," + this.sat.pCentT + "," + this.lum.pCentT + ")";
    }
}
exports.HSLColorPicker = HSLColorPicker;
class HSVColorPicker extends ColorPicker {
    /**
     * Sélecteur de couleurs HSV
     * @param id identifiant du sélecteur
     * @param target support du sélecteur
     * @param px position horizontale
     * @param py position verticale
     * @param current couleur à afficher au lancement
     * @param callbk réaction au changement de sélection
     */
    constructor(id, target, px, py, current, callbk) {
        super(id, target, px, py, current, callbk);
    }
}
exports.HSVColorPicker = HSVColorPicker;
class Button extends display_1.TextField {
    /**
     * Bouton en relief (gradient)
     * @param id identifiant du bouton
     * @param px position horizontale
     * @param py position verticale
     * @param w largeur
     * @param h hauteur
     * @param color couleur de base
     * @param text texte affiché
     * @param rad arrondi des coins en pixels
     */
    constructor(id, target, px, py, w, h, color, text, rad = 12) {
        super();
        this.name = id;
        this.setRect(px, py, w, h);
        this.gradientBackground([0xFFFFFF, color, 0x333333], [0.7, 1, 0.7], [0, 64, 255], 180);
        this.setBorder(1, 0x000000, 1, "solid", rad);
        target.addChild(this);
        this.text = text;
        this.defaultTextFormat = new display_1.TextFormat("Calibri", 14, 0xFFFFFF, false, false, false, "center", 0, 0, 2);
        this.mouseEnabled = true;
        this.selectable = false;
        this.editable = false;
        this.cursor = "pointer";
        this.el.addEventListener("mouseover", e => this.setBrightness(120));
        this.el.addEventListener("mouseup", e => this.setBrightness(110));
        this.el.addEventListener("mousedown", e => this.setBrightness(80));
        this.el.addEventListener("mouseout", e => this.setBrightness(100));
    }
}
exports.Button = Button;
class ResizerGrid extends display_1.Sprite {
    constructor() {
        super();
        this.anchors = [];
        this.name = "resizerGrid";
        this.setRect(0, 0, 100, 100);
        this.mouseEnabled = false; // l'élément actif l'est sous la grille
        let mk = ["pos", "move", "Déplacer",
            "res", "pointer", "Annuler les déformations",
            "siz", "nwse-resize", "Redimensionner",
            "rot", "move", "Faire tourner",
            "sky", "n-resize", "Tordre verticalement",
            "skx", "e-resize", "Tordre horizontalement"];
        for (let i = 0; i < mk.length; i++)
            this.createAnchor(mk[i], mk[++i], mk[++i]);
    }
    /**
     * Définit, affiche et active une ancre de la grille
     * @param name nom de l'ancre
     * @param curs forme du curseur pour l'ancre
     */
    createAnchor(name, curs, title) {
        let spr = new display_1.Sprite;
        spr.name = name;
        spr.setBackground(0x00FFFF, 0.9);
        spr.setBorder(1, 0x0000ff, 0.7, "solid");
        spr.cursor = curs;
        this.addChild(spr);
        spr.addListener("mousedown", this.changeGrid);
        spr.setAttr("title", title);
        this.anchors.push(spr);
        return spr;
    }
    /**
     * Affiche la grille sur un Sprite
     * @param {Sprite} s sprite à modifier
     */
    displayOn(s) {
        const cc = 10, mc = 6, gc = 3, dc = 9;
        let [w, h, mw, mh] = [s.width, s.height, s.width / 2, s.height / 2];
        this.width = w;
        this.height = h;
        for (let anchor of this.anchors) {
            switch (anchor.name) {
                case "pos":
                    anchor.setRect(-gc, -gc, cc, cc);
                    break;
                case "res":
                    anchor.setRect(mw - mc, -gc, cc, cc);
                    break;
                case "rot":
                    anchor.setRect(w - dc, -gc, cc, cc);
                    break;
                case "sky":
                    anchor.setRect(w - dc, mh - mc, cc, cc);
                    break;
                case "siz":
                    anchor.setRect(w - dc, h - dc, cc, cc);
                    break;
                case "skx":
                    anchor.setRect(mw - mc, h - dc, cc, cc);
                    break;
            }
        }
        s.toFront();
        display_1.findIn("rect").value = `(x:${s.x},y:${s.y})-(W:${s.width}-H:${s.height})`;
    }
    /**
     * Modification de la grille par l'une des ancres-
     * @param s ancre qui modifie le Sprite
     * @param e événement souris (mousedown sur l'ancre)
     */
    changeGrid(s, e) {
        const anchor = s, grid = anchor.parent;
        if (grid === null)
            return;
        const stage = anchor.stage;
        if (stage == null)
            return;
        const el = stage.el;
        const model = grid.parent;
        if (model === null)
            return;
        grid.displayOn(model);
        el.addEventListener("mousemove", resizeGrid);
        el.addEventListener("mouseup", endResize);
        function endResize(e) {
            el.removeEventListener("mousemove", resizeGrid);
            el.removeEventListener("mouseup", endResize);
        }
        function resizeGrid(e) {
            let souris = {
                x: model.stageX - (model.x + model.width / 2),
                y: model.stageY - (model.y + model.height / 2)
            };
            let deg = Math.atan2(souris.y, souris.x) * 180 / Math.PI;
            switch (anchor.name) {
                case "pos":
                    model.x += e.movementX;
                    model.y += e.movementY;
                    break;
                case "siz":
                    model.width += e.movementX;
                    model.height += e.movementY;
                    break;
                case "res":
                    model.rotation = 0;
                    model.skewX = 0;
                    model.skewY = 0;
                    break;
                case "rot":
                    deg += 45;
                    model.rotation = deg;
                    break;
                case "skx":
                    deg += 90;
                    model.skewX = -deg;
                    break;
                case "sky":
                    model.skewY = deg;
                    break;
            }
            grid.displayOn(model);
        }
    }
}
exports.ResizerGrid = ResizerGrid;
//# sourceMappingURL=ui.js.map