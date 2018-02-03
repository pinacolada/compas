"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const display_1 = require("./display");
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
    constructor(id, px, py, w, h, color, text, rad = 12) {
        super();
        this.name = id;
        this.setRect(px, py, w, h);
        this.gradientBackground([0xFFFFFF, color, 0x333333], [0.8, 1, 1], [0, 64, 255], 180);
        this.borderRadius = rad;
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
        this.left = this.createAnchor("left", "ew-resize");
        this.top = this.createAnchor("top", "ns-resize");
        this.bottom = this.createAnchor("bottom", "ns-resize");
        this.right = this.createAnchor("right", "ew-resize");
        this.topLeft = this.createAnchor("topLeft", "nwse-resize");
        this.botRight = this.createAnchor("botRight", "nwse-resize");
    }
    createAnchor(name, curs) {
        let el = new display_1.Sprite;
        el.name = name;
        el.setBackground(0x00FFFF, 0.9);
        el.setBorder(1, 0x0000ff, 0.7, "solid");
        el.cursor = curs;
        this.addChild(el);
        el.addEventListener("mousedown", this.changeGrid);
        return el;
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