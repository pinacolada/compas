import { Graphics } from "./graph";
import { DisplayObject } from "./display";
import { valueOf } from "./ui";

/**
 * Position, dimension et transformations
 * @author Jean-Marie PETIT
 */
export class Rectangle {
    css: CSSStyleDeclaration;
    // disp: DisplayObject;
    val: number[] = [0,0,0,0,0,0,0,1,1]; // x, y, width, height, rotDeg, skewXDeg skewYDeg, scaleX, scaleY

    constructor(css:CSSStyleDeclaration) {
        this.css = css;
        this.css.position = "absolute";
        this.css.boxSizing = "border-box";
        this.css.overflow = "hidden";
        this.css.margin = "0";
        this.css.padding = "0";
    }
    toCss(): void {
        if (this.css == undefined) return;
        this.css.left = this.val[0] + "px";
        this.css.top = this.val[1] + "px";
        this.css.width = this.val[2] + "px";
        this.css.height = this.val[3] + "px";
        this.css.transform = "rotate(" + this.val[4] + "deg)" +
            "skew(" + this.val[5] + "deg, " + this.val[6] + "deg)"
    }
    /**
     * Définit la position et la taille du rectangle
     * @param px position horizontale
     * @param py position verticale
     * @param w largeur
     * @param h hauteur
     */
    setTo(px: number = 0, py: number = 0, w: number = 0, h: number = 0): void {
        this.x = px;
        this.y = py;
        this.width = w;
        this.height = h;
    }

    get style(): CSSStyleDeclaration {
        return this.css;
    }

    get left(): number {
        return this.x;
    }
    set left(value: number) {
        this.x = value; 
    }
    get top(): number {
        return this.y;
    }
    set top(value: number) {
        this.y = value;
    }
    get right(): number {
        return this.x + this.width;
    }
    get bottom(): number {
        return this.y + this.height;
    }
    get x(): number {
        return this.val[0];
    }
    set x(value: number) {
        this.val[0] = value;
        this.toCss();
    }
    get y(): number {
        return this.val[1];
    }
    set y(value: number) {
        this.val[1] = value;
        this.toCss();
    }
    get width(): number {
        return this.val[2];
    }
    set width(value: number) {
        this.val[2] = value;
        this.toCss();
    }
    get height(): number {
        return this.val[3];
    }
    set height(value: number) {
        this.val[3] = value;
        this.toCss();
    }
    get rot(): number {
        return this.val[4];
    }
    set rot(value: number) {
        this.val[4] = value;
        this.toCss();
    }
    get skX(): number {
        return this.val[5];
    }
    set skX(value: number) {
        this.val[5] = value;
        this.toCss();
    }
    get skY(): number {
        return this.val[6];
    }
    set skY(value: number) {
        this.val[6] = value;
        this.toCss();
    }
    get scX(): number {
        return this.val[7];
    }
    set scX(value: number) {
        this.val[7] = value;
        this.toCss();
    }
    get scY(): number {
        return this.val[8];
    }
    set scY(value: number) {
        this.val[8] = value;
        this.toCss();
    }
    toString(): string {
        return `(x:${this.val[0]},y:${this.val[1]})-(${this.val[2]} x ${this.val[3]})`;
    }
}
