import { TextField, TextFormat, Sprite, findIn, Stage } from "./display";

export class Button extends TextField {
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
    constructor(id: string, px: number, py: number, w: number, h: number, color:number, text: string, rad:number=12) {
        super();
        this.name = id;
        this.setRect(px, py, w, h);
        this.gradientBackground([0xFFFFFF, color, 0x333333], [0.8, 1, 1], [0, 64, 255], 180);
        this.borderRadius = rad;
        this.text = text;
        this.defaultTextFormat = new TextFormat("Calibri", 14, 0xFFFFFF, false, false, false, "center", 0, 0, 2);
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

export class DisplayGrid extends Sprite {
    left: Sprite;
    top: Sprite;
    bottom: Sprite;
    right: Sprite;
    topLeft: Sprite;
    botRight: Sprite;

    constructor() {
        super();
        this.name = "displayGrid";
        this.setRect(0, 0, 100, 100);
        this.mouseEnabled = false;// l'élément actif l'est sous la grille
        this.left = this.createAnchor("left", "ew-resize");
        this.top = this.createAnchor("top", "ns-resize");
        this.bottom = this.createAnchor("bottom", "ns-resize");
        this.right = this.createAnchor("right", "ew-resize");
        this.topLeft = this.createAnchor("topLeft", "nwse-resize");
        this.botRight = this.createAnchor("botRight", "nwse-resize");
    }
    createAnchor(name: string, curs:string): Sprite {
        let el = new Sprite;
        el.name = name;
        el.setBackground(0x00FFFF, 0.9);
        el.setBorder(1, 0x0000ff, 0.7, "solid");
        el.cursor = curs;
        this.addChild(el);
        el.addEventListener("mousedown", this.changeGrid);
        return el;
    }
    ajustTo(s: Sprite) {
        const cc = 10, mc = 6, gc = 3, dc = 9; 
        let [w, h, mw, mh] = [s.width, s.height, s.width / 2, s.height / 2];
        this.width = w;
        this.height = h;
        this.left.setRect(-gc, mh - mc, cc, cc);
        this.top.setRect(mw - mc, - gc, cc, cc);
        this.bottom.setRect(mw - mc, h - dc, cc, cc);
        this.right.setRect(w - dc, mh - mc, cc, cc);
        this.topLeft.setRect(-gc, -gc, cc, cc);
        this.botRight.setRect(w - dc, h - dc, cc, cc);
        findIn("rect").value = `(x:${s.x},y:${s.y})-(W:${s.width}-H:${s.height})`;
    }
    /**
     * Modification de la grille par l'une des ancres
     * @param s ancre qui modifie le Sprite
     * @param e événement souris (mousedown sur l'ancre)
     */
    changeGrid(s: Sprite, e: MouseEvent) {
        const anchor = s, grid = anchor.parent as DisplayGrid;
        if (grid === null) return;
        const stage = anchor.stage;
        if (stage == null) return;
        const el = stage.el;
        const model: Sprite = grid.parent as Sprite;
        if (model === null) return;
        grid.ajustTo(model);
        el.addEventListener("mousemove", resizeGrid);
        el.addEventListener("mouseup", endResize);

        function endResize(e: MouseEvent) {
            el.removeEventListener("mousemove", resizeGrid);
            el.removeEventListener("mouseup", endResize);                
        }
        function resizeGrid(e: MouseEvent) {
            switch (anchor.name) {
                case "left": model.x += e.movementX; break;
                case "top": model.y += e.movementY; break;
                case "right": model.width += e.movementX; break;
                case "bottom": model.height += e.movementY; break;
                case "topLeft": model.x += e.movementX; model.y += e.movementY; break;
                case "botRight": model.width += e.movementX; model.height += e.movementY;    
            } 
            grid.ajustTo(model);
        }        
    }
}