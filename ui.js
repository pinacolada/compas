"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const display_1 = require("./display");
function between(val, min, max) {
    if (val < min)
        return min;
    if (val > max)
        return max;
    return val;
}
function percent(val, min, max) {
    return (val - min) / (max - min);
}
function valueOf(pct, min, max) {
    return Math.floor(((max - min) * pct) + min);
}
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
class Label extends display_1.TextField {
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
        this.value = 0;
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
            let pos = between(sld.mouseX - 12, 1, sld.maxCurs);
            sld.value = percent(pos, 1, sld.maxCurs);
            sld.show();
            sld.dispatch("change");
        }
    }
    setValues(minValue, maxValue, currentValue) {
        this.min = minValue;
        this.max = maxValue;
        this.value = percent(currentValue, minValue, maxValue);
        this.show();
    }
    show() {
        this.curs.x = valueOf(this.value, 1, this.maxCurs);
        this.label.text = this.name + ": " + (this.viewPercent ?
            this.pCentT : valueOf(this.value, this.min, this.max).toString());
    }
    get pCentT() {
        return (this.value * 100).toFixed(0) + "%";
    }
}
exports.Slider = Slider;
class RGBColorPicker extends Box {
    constructor(id, target, px, py, currentColor) {
        super(id, target, px, py, 250, 180, 0x666666, 0xFFFFFF, "outset", 4);
        this.view = new Box("view", this, 3, 3, 30, 20, currentColor, 0x999999, "inset", 0);
        this.view.cursor = "pointer";
        this.view.addListener("click", (b, e) => this.toggleFold(this, b));
        var t = "0369CF", c = "", r, g, b, px = 4, py = 28;
        let view = this.view, pal = this;
        for (r = 0; r < t.length; r++) {
            for (g = 0; g < t.length; g++) {
                for (b = 0; b < t.length; b++) {
                    c = "#" + t.charAt(r) + t.charAt(r) + t.charAt(g) + t.charAt(g) + t.charAt(b) + t.charAt(b);
                    addColor(this.el, px, py, c);
                    px += 12;
                    if (px > 219) {
                        px = 4;
                        py += 11;
                    }
                }
            }
        }
        let mag = new Box("mag", this, 100, 100, 20, 20, 0xFFFFFF, 0xFFFFFF, "outset", 2);
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
                view.css.backgroundColor = c;
                mag.x = x - 4;
                mag.y = y - 4;
                mag.css.backgroundColor = c;
            });
            d.addEventListener("mouseout", e => {
                view.css.backgroundColor = pal.rgb;
                if (pal.sel) {
                    mag.x = parseInt(pal.sel.style.left) - 4;
                    mag.y = parseInt(pal.sel.style.top) - 4;
                    mag.css.backgroundColor = pal.sel.id;
                }
            });
            d.addEventListener("click", e => {
                pal.rgb = c;
                pal.toggleFold(pal, view);
                pal.sel = d;
                if (pal.callback)
                    pal.callback(pal);
            });
            el.appendChild(d);
        }
        this.toggleFold(this, this.view);
    }
    toggleFold(pal, b) {
        if (pal.width > 50) {
            pal.width = 40, pal.height = 30;
        }
        else {
            pal.width = 250, pal.height = 180;
        }
    }
}
exports.RGBColorPicker = RGBColorPicker;
class HSLColorPicker extends Box {
    constructor(id, target, px, py, currentColor) {
        super(id, target, px, py, 250, 180, 0x666666, 0xFFFFFF, "outset", 4);
        this.view = new Box("view", this, 3, 3, 30, 20, currentColor, 0x999999, "inset", 0);
        this.view.cursor = "pointer";
        this.view.addListener("click", (b, e) => this.foldUnfold(this, b));
        this.hue = new Slider("Hue", this, 10, 35, 210, 0, 0, 360, false);
        const par6 = 255 / 6;
        this.hue.gradientBackground([0xFF0000, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0xFF00FF, 0xFF0000], [1, 1, 1, 1, 1, 1, 1], [0, par6, par6 * 2, par6 * 3, par6 * 4, par6 * 5, par6 * 6, 255], 90);
        this.sat = new Slider("Sat", this, 10, 80, 210, 100, 0, 100, true);
        this.sat.gradientBackground([0x000000, 0xFFFFFF], [1, 1], [0, 255], 90);
        this.lum = new Slider("Lum", this, 10, 125, 210, 50, 0, 100, true);
        this.lum.gradientBackground([0x000000, 0xFFFFFF], [1, 1], [0, 255], 90);
        this.hue.addListener("change", (s, e) => this.show());
        this.sat.addListener("change", (s, e) => this.show());
        this.lum.addListener("change", (s, e) => this.show());
        this.show();
        this.foldUnfold(this, this.view);
    }
    foldUnfold(pal, b) {
        if (pal.width > 50) {
            pal.width = 40, pal.height = 30;
        }
        else {
            pal.width = 250, pal.height = 180;
        }
    }
    show() {
        this.hsl = "hsl(" + Math.floor(this.hue.value * 360) + "," + this.sat.pCentT + "," + this.lum.pCentT + ")";
        this.view.css.backgroundColor = this.hsl;
        if (this.callback)
            this.callback(this);
    }
}
exports.HSLColorPicker = HSLColorPicker;
class Button extends display_1.TextField {
    /**
     *
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
        this.gradientBackground([0xFFFFFF, color, 0x333333], [0.8, 1, 0.8], [0, 64, 255], 180);
        this.setBorder(1, 0x000000, 1, "solid", rad);
        target.addChild(this);
        this.text = text;
        this.defaultTextFormat = new display_1.TextFormat("Calibri", 14, 0xFFFFFF, false, false, false, "center", 0, 0, 2);
        this.mouseEnabled = true;
        this.selectable = false;
        this.editable = false;
        this.cursor = "pointer";
        this.el.addEventListener("mouseover", e => this.setLigth(120));
        this.el.addEventListener("mouseup", e => this.setLigth(110));
        this.el.addEventListener("mousedown", e => this.setLigth(80));
        this.el.addEventListener("mouseout", e => this.setLigth(100));
    }
}
exports.Button = Button;
class DisplayGrid extends display_1.Sprite {
    constructor() {
        super();
        this.name = "displayGrid";
        this.setRect(0, 0, 100, 100);
        this.mouseEnabled = false; // l'élément actif l'est sous la grille
        this.left = this.createAnchor("left", "e-resize");
        this.top = this.createAnchor("top", "n-resize");
        this.bottom = this.createAnchor("bottom", "s-resize");
        this.right = this.createAnchor("right", "w-resize");
        this.topLeft = this.createAnchor("topLeft", "nwse-resize");
        this.botRight = this.createAnchor("botRight", "nwse-resize");
    }
    createAnchor(name, curs) {
        let spr = new display_1.Sprite;
        spr.name = name;
        spr.setBackground(0x00FFFF, 0.9);
        spr.setBorder(1, 0x0000ff, 0.7, "solid");
        spr.cursor = curs;
        this.addChild(spr);
        spr.addListener("mousedown", this.changeGrid);
        return spr;
    }
    ajustTo(s) {
        const cc = 10, mc = 6, gc = 3, dc = 9;
        let [w, h, mw, mh] = [s.width, s.height, s.width / 2, s.height / 2];
        this.width = w;
        this.height = h;
        this.left.setRect(-gc, mh - mc, cc, cc);
        this.top.setRect(mw - mc, -gc, cc, cc);
        this.bottom.setRect(mw - mc, h - dc, cc, cc);
        this.right.setRect(w - dc, mh - mc, cc, cc);
        this.topLeft.setRect(-gc, -gc, cc, cc);
        this.botRight.setRect(w - dc, h - dc, cc, cc);
        display_1.findIn("rect").value = `(x:${s.x},y:${s.y})-(W:${s.width}-H:${s.height})`;
    }
    /**
     * Modification de la grille par l'une des ancres
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
        grid.ajustTo(model);
        el.addEventListener("mousemove", resizeGrid);
        el.addEventListener("mouseup", endResize);
        function endResize(e) {
            el.removeEventListener("mousemove", resizeGrid);
            el.removeEventListener("mouseup", endResize);
        }
        function resizeGrid(e) {
            switch (anchor.name) {
                case "left":
                    model.x += e.movementX;
                    break;
                case "top":
                    model.y += e.movementY;
                    break;
                case "right":
                    model.width += e.movementX;
                    break;
                case "bottom":
                    model.height += e.movementY;
                    break;
                case "topLeft":
                    model.x += e.movementX;
                    model.y += e.movementY;
                    break;
                case "botRight":
                    model.width += e.movementX;
                    model.height += e.movementY;
            }
            grid.ajustTo(model);
        }
    }
}
exports.DisplayGrid = DisplayGrid;
//# sourceMappingURL=ui.js.map