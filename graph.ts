import { Point, Rectangle, Matrix, Filter } from "./geom";

export class Color {
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
    /**
     * Style associé au remplissage
     */
    css: CSSStyleDeclaration;

    val: number[];
    /**
     * Remplissage uni dans un Graphics
     * @param c couleur entre 0x000000 et 0xFFFFFF
     * @param a transparence entre 0.0 (transparent) et 1.0 (opaque)
     */
    constructor(c: number=0xFFFFFF, a: number=1.0) {
        this.val = [c, a, 0];
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
}

/**
 * Bord d'une forme graphique ou trait d'une ligne
 * @author Jean-Marie PETIT
 */
export class Stroke extends Fill {
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

    get css(): string {
        let coul: string = this.stops.map((s: GradientStop) => s.css).join(",");
        return this.type + "-gradient(" + this.degres + "deg," + coul + ")";
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
    _pos: Point;
    el: HTMLElement;
    constructor(e: HTMLElement) {
        this.el = e;
        this._pos = new Point(0, 0);
    }
    clear(): void {
        this.fill = null;
        this.stroke = null;
        this.gradient = null;
        this._pos = new Point(0, 0);
    }
    beginFill(color?: number, alpha: number = 1.0): void {
        if (color != undefined) {
            this.fill = new Fill(color, alpha);
        } else {
            this.fill = null;
        }
    }
    beginGradientFill(type:"linear"|"radial", colors: number[], alphas: number[], ratios: number[], angle: number): void {
        this.gradient = new Gradient(type, colors, alphas, ratios, angle);

    }
    drawCircle(x: number, y: number, radius: number): void {

        this._pos.setTo(x, y);
    }
    drawEllipse(x: number, y: number, width: number, height: number): void {

        this._pos.setTo(x, y);
    }
    drawRect(x: number, y: number, width: number, height: number): void {

        this._pos.setTo(x, y);
    }
    drawRoundRect(x: number, y: number, width: number, height: number, xRadius: number, yRadius?: number): void {

        this._pos.setTo(x, y);
    }
    cubicCurveTo(ax1: number, ay1: number, ax2: number, ay2: number, x: number, y: number): void {

        this._pos.setTo(x, y);
    }
    curveTo(ax: number, ay: number, x: number, y: number): void {

        this._pos.setTo(x, y);
    }
    endFill(): void {

    }
    lineStyle(thickness?: number, color?: number, alpha?: number): void {
        this.stroke = (color != undefined) ?
            new Stroke(thickness, color, alpha) : null;
    }
    lineTo(x: number, y: number): void {
        
        this._pos.setTo(x, y);
    }
    moveTo(x: number, y: number): void {
        this._pos.setTo(x, y);
    }
}