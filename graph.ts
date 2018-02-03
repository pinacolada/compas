import { Point, Rectangle, Matrix, Filter } from "./geom";
import { DisplayObject } from "./display";

export class Color {
    
    static hex(rgba: string): number {
        let t = rgba.split("(")[1].split(",");
        let [r, g, b] = [parseInt(t[0]), parseInt(t[1]), parseInt(t[2])];
        return r << 16 | g << 8 & b;
    }
    /**
     * Renvoie une couleur sous la forme : rgb(r,g,b)
     * @param c couleur entre 0x000000 et 0xFFFFFF
     */
    static rgb(c: number): string {
        c = (c < 0) ? 0 : c > 0xFFFFFF ? 0xFFFFFF : c;
        let [r, g, b] = [c >> 16 & 0xFF, c >> 8 & 0xFF, c & 0xFF];
        return `rgb(${r},${g},${b})`;
    }
    /**
     * Renvoie une couleur sous la forme : rgba(r,g,b,a)
     * @param c couleur entre 0x000000 et 0xFFFFFF
     * @param a transparence entre 0.0 (transparent) et 1.0 (opaque) 
     */
    static rgba(c: number, a: number): string {
        c = (c < 0) ? 0 : c > 0xFFFFFF ? 0xFFFFFF : c;
        let [r, g, b] = [c >> 16 & 0xFF, c >> 8 & 0xFF, c & 0xFF];
        return `rgba(${r},${g},${b},${a.toFixed(2)})`;
    }
}
/**
 * Remplissage uni dans un Graphics
 * @author Jean-Marie PETIT
 */
export class Fill {

    val: number[];
    /**
     * Remplissage uni dans un Graphics
     * @param c couleur entre 0x000000 et 0xFFFFFF
     * @param a transparence entre 0.0 (transparent) et 1.0 (opaque)
     */
    constructor(c: number = 0xFFFFFF, a: number = 1.0) {
        this.val = [c, a, 0];
    }

    setTo(c: number=0xFFFFFF, a: number=1.0): Fill {
        this.val = [c, a, 0];
        return this;
    }
    /**
    * Couleur entre 0x000000 et 0xFFFFFF
    */
    get color():number {
      return this.val[0];
    }
    set color(value:number) {
      this.val[0] = value;
    }

    /**
    * Transparence entre 0.0 (transparent) et 1.0 (opaque)
    */
    get alpha():number {
        return this.val[1];
      }
      set alpha(value:number) {
        this.val[1] = value;
    }
    /**
     * Valeur RGBA pour CSS
     */
    get rgba(): string {
        return Color.rgba(this.color, this.alpha);
    }
    /**
     * Valeur RGB pour SVG
     */
    get rgb(): string {
        return Color.rgb(this.color);
    }
}

/**
 * Bord d'une forme graphique ou trait d'une ligne
 * @author Jean-Marie PETIT
 */
export class Stroke extends Fill {
    /**
     * stroke-linecap = "butt"|"square"|"round"
     */
    lineCap:string= "round"; //  stroke-linecap : coupé (butt), carré (square) ou arrondi (round).
    /**
     * Bord d'une forme graphique ou trait d'une ligne
     * @param t épaisseur du trait
     * @param c couleur du trait entre 0x000000 et 0xFFFFFF
     * @param a transparence du trait entre 0.0 (transparent) et 1.0 (opaque)
     */
    constructor(t: number = 1.0, c: number = 0x000000, a: number = 1.0) {
        super(c, a);
        this.thickness = t;
    }
    setTo(t: number = 1.0, c: number = 0x000000, a: number = 1.0): Stroke {
        this.color = c;
        this.alpha = a;
        this.thickness = t;
        return this;
    }
    /**
    * épaisseur du trait
    */
    get thickness():number {
        return this.val[2];
    }
    set thickness(value:number) {
        this.val[2] = value;
    }
}
/**
 * Couleur dans un dégradé
 * @author Jean-Marie PETIT
 */
export class GradientStop {
    /**
     * transparence entre 0.0 (transparent) et 1.0 (opaque)
     */
    alpha: number;
    /**
     * couleur entre 0x000000 et 0xFFFFFF
     */
    color: number;
    /**
     * position entre 0 et 255 (0 = début 255 = fin) 
     */
    ratio: number;
    /**
     * Couleur dans un dégradé
     * @param c couleur entre 0x000000 et 0xFFFFFF
     * @param a transparence entre 0.0 (transparent) et 1.0 (opaque)
     * @param r position entre 0 et 255 (0 = début 255 = fin) 
     */
    constructor(c: number, a: number, r: number) {
        this.color = c;
        this.alpha = a;
        this.ratio = (r/255)*100;
    }
    get css(): string {
        return Color.rgba(this.color, this.alpha) + " " + this.ratio + "%";
    }
}

/**
* Dégradé (conteneur de GradientStops)
* @author Jean-Marie PETIT
*/
export class Gradient {
    type: string;
    stops: GradientStop[];
    degres: number;
    id: string;
    /**
     * Dégradé (conteneur de GradientStops)
     * @param type type du dégradé ("linear"|"radial")
     * @param colors liste des couleurs dans l'ordre du dégradé
     * @param alphas liste des transparence dans l'ordre du dégradé
     * @param ratios positions des couleurs entre 0 et 255
     * @param angle orientation du dégradé en degrés
     */
    constructor(type:"linear"|"radial", colors: number[], alphas: number[], ratios: number[], angle: number) {
        this.clear();
        this.type = type;
        this.degres = angle;
        for (var i: number = 0; i < colors.length; i++) {
            this.addStop(colors[i], alphas[i], ratios[i]);
        }
    }
    /**
     * Définit l'une des positions dans le dégradé
     * @param c couleur entre 0x000000 et 0xFFFFFF
     * @param a transparence entre 0.0 (transparent) et 1.0 (opaque)
     * @param r position entre 0 et 255 (0 = début 255 = fin)
     */
    addStop(c: number, a: number, r: number): void {
        this.stops.push(new GradientStop(c, a, r));
        this.stops.sort((a: GradientStop, b: GradientStop): number => {
            return a.ratio < b.ratio ? -1 : a.ratio > b.ratio ? 1 : 0;
        });
    }
    /**
     * Supprime toutes les GradientStops du dégradé
     */
    clear(): void {
        this.stops = [];
    }
    /**
     * Description complète du dégradé en CSS
     */
    get css(): string {
        let coul: string = this.stops.map((s: GradientStop) => s.css).join(",");
        return this.type + "-gradient(" + this.degres + "deg," + coul + ")";
    }
    get svg(): string {
        return "";
    }
}

class GrElement {
    el: SVGElement;
    constructor(gr:Graphics, type:string, bg:boolean) {
        this.el = document.createElementNS("http://www.w3.org/2000/svg", type);
        gr.svg.appendChild(this.el); 
        this.el.id = type + "_" + gr.svg.children.length;
        if (bg) {
            if (gr.fill) {
                this.setAttr("fill", gr.fill.rgba); 
            } else if (gr.gradient) {
                this.setAttr("fill", "#" + gr.gradient.id);
            }
        } else {
            this.setAttr("fill", "none");
        }
        if (gr.stroke) {
            this.setAttr("stroke", gr.stroke.rgba);
            if (gr.stroke.thickness != 1) {
                this.setAttr("stroke-width", gr.stroke.thickness);
            }   
        } 
    }
    setAttr(attrName: string, attrVal: any): void {
        this.el.setAttribute(attrName, attrVal.toString());
    }
}

class GrCircle extends GrElement {
    circle: SVGCircleElement;
    constructor(gr:Graphics, px: number, py: number, radius: number) {
        super(gr, "circle", true);
        this.circle = this.el as SVGCircleElement;
        this.r = radius;
        this.x = px;
        this.y = py;
    }
    get x(): number {
        return this.cx - this.r;
    }
    set x(value: number) {
        this.cx = value + this.r;
    }
    get y(): number {
        return this.cy - this.r;
    }
    set y(value: number) {
        this.cy = value + this.r;
    }
    get cx(): number {
        return this.circle.cx.baseVal.value;
    }
    set cx(value: number) {
        this.circle.cx.baseVal.value = value;
    }
    get cy(): number {
        return this.circle.cy.baseVal.value;
    }
    set cy(value: number) {
        this.circle.cy.baseVal.value = value;
    }
    get r(): number {
        return this.circle.r.baseVal.value;
    }
    set r(value: number) {
        this.circle.r.baseVal.value = value;
    }
}
class GrEllipse extends GrElement {
    ellipse: SVGEllipseElement;
    constructor(gr:Graphics, x: number, y: number, width: number, height:number) {
        super(gr, "ellipse", true);
        this.ellipse = this.el as SVGEllipseElement;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    get x(): number {
        return this.cx - this.rx;
    }
    set x(value: number) {
        this.cx = value + this.rx;
    }
    get y(): number {
        return this.cy - this.ry;
    }
    set y(value: number) {
        this.cy = value + this.ry;
    }
    get cx(): number {
        return this.ellipse.cx.baseVal.value;
    }
    set cx(value: number) {
        this.ellipse.cx.baseVal.value = value;
    }
    get cy(): number {
        return this.ellipse.cy.baseVal.value;
    }
    set cy(value: number) {
        this.ellipse.cy.baseVal.value = value;
    }
    get rx(): number {
        return this.ellipse.rx.baseVal.value;
    }
    set rx(value: number) {
        this.ellipse.rx.baseVal.value = value;
    }
    get ry(): number {
        return this.ellipse.ry.baseVal.value;
    }
    set ry(value: number) {
        this.ellipse.ry.baseVal.value = value;
    }
    get width(): number {
        return this.rx * 2;
    }
    set width(value: number) {
        this.rx = value / 2;
    }
    get height(): number {
        return this.ry * 2;
    }
    set height(value: number) {
        this.ry = value / 2;
    }
}
class GrLine extends GrElement {
    line: SVGLineElement;
    constructor(gr:Graphics, px: number, py: number, x: number, y:number) {
        super(gr, "line", false);
        this.line = this.el as SVGLineElement;
        this.x1 = px;
        this.y1 = py;
        this.x2 = x;
        this.y2 = y;
    }
    get x1(): number {
        return this.line.x1.baseVal.value;
    }
    set x1(value: number) {
        this.line.x1.baseVal.value = value;
    }
    get y1(): number {
        return this.line.y1.baseVal.value;
    }
    set y1(value: number) {
        this.line.y1.baseVal.value = value;
    }
    get x2(): number {
        return this.line.x2.baseVal.value;
    }
    set x2(value: number) {
        this.line.x2.baseVal.value = value;
    }
    get y2(): number {
        return this.line.y2.baseVal.value;
    }
    set y2(value: number) {
        this.line.y2.baseVal.value = value;
    }
}
class GrPolyline extends GrElement {
    lines: SVGPolylineElement;
    constructor(gr: Graphics,startX:number, startY:number, points: number[]) {
        super(gr, "polyline", false);
        this.lines = this.el as SVGPolylineElement;
        this.setAttr("points", startX + " " + startY +" "+ points.join(" "));        
    }
}
class GrPath extends GrElement {
    constructor(gr: Graphics, close:boolean,cmd:string) {
        super(gr, "path", close);
        this.command = cmd;
        this.setAttr("d", this.command);
    }
    get command(): string {
        return <string>this.el.getAttribute("d");
    }
    set command(value: string) {
        this.el.setAttribute("d", value);
    }
    /**
     * M = moveto
     */
    moveTo(x: number, y: number) {
        let cmd = this.command;  
        this.command = cmd + ` M ${x} ${y}`;
    }
    /**
     * L = lineto
     */
    lineTo(bAbs: boolean, x: number, y: number) {
        let cmd = this.command;  
        this.command = cmd + ` ${bAbs ? "L" : "l"} ${x} ${y}`;
    }
    /**
    * H = horizontal lineto
    */
    hLineTo(bAbs: boolean, x: number) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "H": "h"} ${x}`;  
    }
    /**
    * V = vertical lineto
    */
    vLineTo(bAbs: boolean, y: number) {
        let cmd = this.command;  
        this.command = cmd + ` ${bAbs ? "V" : "v"} ${y}`;
    }
    /**
    * C = curveto
    */
    cubicCurveTo(bAbs: boolean, ax1: number, ay1: number, ax2: number, ay2: number, x: number, y: number) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "C": "c"} ${ax1} ${ay1} ${ax2} ${ay2} ${x} ${y}`;  
    }
    /**
    * S = smooth curveto
    */
    smoothCubicCurveTo(bAbs: boolean, ax1: number, ay1: number, ax2: number, ay2: number, x: number, y: number) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "S": "s"} ${x} ${y}`;  
    }    

    /**
    * Q = quadratic Bézier curve
    */
    quadraticCurveTo(bAbs: boolean, ax: number, ay: number, x:number, y:number) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "Q": "q"} ${ax} ${ay} ${x} ${y}`;  
    }

    /**
    * T = smooth quadratic Bézier curveto
    */
    smoothQuadraticCurveTo(bAbs: boolean, ax: number, ay: number, x:number, y:number) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "T": "t"} ${ax} ${ay} ${x} ${y}`;  
    }
     /**
    * A = elliptical Arc
    */
    ellipticalArc(bAbs: boolean, x: number, y: number) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "A": "a"} ${x} ${y}`;  
    }
    /*
    * Z = closepath
    */
    closePath() {
        let cmd = this.command;
        this.command = cmd + " Z";
    }
}
class GrPolygone extends GrElement {
    lines: SVGPolylineElement;
    constructor(gr: Graphics, points: number[]) {
        super(gr, "polygon", true);
        this.lines = this.el as SVGPolylineElement;
        this.setAttr("points", points.join(" "));        
    }
}
class GrRect extends GrElement {
    rect: SVGRectElement;
    constructor(gr:Graphics, px: number, py: number, w: number, h:number, xRadius?:number, yRadius?:number) {
        super(gr, "rect", true);
        this.rect = this.el as SVGRectElement;
        this.x = px;
        this.y = py;
        this.width = w;
        this.height = h;
        if (xRadius) {
            this.rx = xRadius;
            this.ry = xRadius;
            if (yRadius) {
               this.ry = yRadius; 
            }
        }
    }
    get x(): number {
        return this.rect.x.baseVal.value;
    }
    set x(value: number) {
        this.rect.x.baseVal.value = value;
    }
    get y(): number {
        return this.rect.y.baseVal.value;
    }
    set y(value: number) {
        this.rect.y.baseVal.value = value;
    }
    get rx(): number {
        return this.rect.rx.baseVal.value;
    }
    set rx(value: number) {
        this.rect.rx.baseVal.value = value;
    }
    get ry(): number {
        return this.rect.ry.baseVal.value;
    }
    set ry(value: number) {
        this.rect.ry.baseVal.value = value;
    }
    get width(): number {
        return this.rect.width.baseVal.value;
    }
    set width(value: number) {
        this.rect.width.baseVal.value = value;
    }
    get height(): number {
        return this.rect.width.baseVal.value;
    }
    set height(value: number) {
        this.rect.width.baseVal.value = value;
    }
}
/**
 * Commandes graphiques 
 * associées à un DisplayObject (Sprite, Shape,...)
 * @author Jean-Marie PETIT
 */
export class Graphics {
    fill: Fill | null;
    stroke: Stroke | null;
    gradient: Gradient | null;
    pos: Point;
    svg: SVGSVGElement;
    constructor(disp: DisplayObject, el:HTMLElement) {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.style.pointerEvents = "none";
        el.appendChild(this.svg);
        this.svg.setAttribute("width", "100%");
        this.svg.setAttribute("height", "100%");
        this.clear();
    }
    clear(): void {
        this.fill = null;
        this.stroke = null;
        this.gradient = null;
        while (this.svg.lastChild) {
           this.svg.removeChild(this.svg.lastChild) 
        }
        this.pos = new Point(0, 0);
    }
    beginFill(color?: number, alpha: number = 1.0): void {
        this.gradient = null;
        if (color != undefined) {
            this.fill = new Fill(color, alpha);
        } else {
            this.fill = null;
        }
    }
    beginGradientFill(type:"linear"|"radial", colors: number[], alphas: number[], ratios: number[], angle: number): void {
        this.fill = null;
        this.gradient = new Gradient(type, colors, alphas, ratios, angle);
    }
    drawCircle(x: number, y: number, radius: number): void {
        const draw = new GrCircle(this, x, y, radius);
    }
    drawEllipse(x: number, y: number, width: number, height: number): void {
        const draw = new GrEllipse(this, x, y, width, height);
        this.pos.setTo(x, y);
    }
    drawPolygon(...num:number[]) {
        const draw = new GrPolygone(this, num);
        this.pos.setTo(num[num.length - 2], num[num.length - 1]);
    }
    drawRect(x: number, y: number, width: number, height: number): void {
        const draw = new GrRect(this, x, y, width, height);
    }
    drawRoundRect(x: number, y: number, width: number, height: number, xRadius: number, yRadius?: number): void {
        const draw = new GrRect(this, x, y, width, height, xRadius, yRadius);
        this.pos.setTo(x, y);
    }
    cubicCurveTo(ax1: number, ay1: number, ax2: number, ay2: number, x: number, y: number): void {
        const draw = new GrPath(this, false, ` M ${this.pos.x} ${this.pos.y}`);
        draw.cubicCurveTo(true, ax1, ay1, ax2, ay2, x, y);
        this.pos.setTo(x, y);
    }
    curveTo(ax: number, ay: number, x: number, y: number): void {

        this.pos.setTo(x, y);
    }
    endFill(): void {
    }
    lineStyle(thickness?: number, color?: number, alpha?: number): void {
        this.stroke = (color != undefined) ?
            new Stroke(thickness, color, alpha) : null;
    }
    lineTo(x: number, y: number): void {
        const line = new GrLine(this, this.pos.x, this.pos.y, x, y);
        this.pos.setTo(x, y);
    }
    moveTo(x: number, y: number): void {
        this.pos.setTo(x, y);
    }
}