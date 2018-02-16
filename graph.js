"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Color {
    static hex(rgba) {
        let t = rgba.split("(")[1].split(",");
        let [r, g, b] = [parseInt(t[0]), parseInt(t[1]), parseInt(t[2])];
        return r << 16 | g << 8 & b;
    }
    /**
     * Renvoie une couleur sous la forme : rgb(r,g,b)
     * @param c couleur entre 0x000000 et 0xFFFFFF
     */
    static rgb(c) {
        c = (c < 0) ? 0 : c > 0xFFFFFF ? 0xFFFFFF : c;
        let [r, g, b] = [c >> 16 & 0xFF, c >> 8 & 0xFF, c & 0xFF];
        return `rgb(${r},${g},${b})`;
    }
    /**
     * Renvoie une couleur sous la forme : rgba(r,g,b,a)
     * @param c couleur entre 0x000000 et 0xFFFFFF
     * @param a transparence entre 0.0 (transparent) et 1.0 (opaque)
     */
    static rgba(c, a) {
        c = (c < 0) ? 0 : c > 0xFFFFFF ? 0xFFFFFF : c;
        let [r, g, b] = [c >> 16 & 0xFF, c >> 8 & 0xFF, c & 0xFF];
        return `rgba(${r},${g},${b},${a.toFixed(2)})`;
    }
}
exports.Color = Color;
/**
 * Remplissage uni dans un Graphics
 * @author Jean-Marie PETIT
 */
class Fill {
    /**
     * Remplissage uni dans un Graphics
     * @param c couleur entre 0x000000 et 0xFFFFFF
     * @param a transparence entre 0.0 (transparent) et 1.0 (opaque)
     */
    constructor(c = 0xFFFFFF, a = 1.0) {
        this.val = [c, a, 0];
    }
    setTo(c = 0xFFFFFF, a = 1.0) {
        this.val = [c, a, 0];
        return this;
    }
    /**
    * Couleur entre 0x000000 et 0xFFFFFF
    */
    get color() {
        return this.val[0];
    }
    set color(value) {
        this.val[0] = value;
    }
    /**
    * Transparence entre 0.0 (transparent) et 1.0 (opaque)
    */
    get alpha() {
        return this.val[1];
    }
    set alpha(value) {
        this.val[1] = value;
    }
    /**
     * Valeur RGBA pour CSS
     */
    get rgba() {
        return Color.rgba(this.color, this.alpha);
    }
    /**
     * Valeur RGB pour SVG
     */
    get rgb() {
        return Color.rgb(this.color);
    }
}
exports.Fill = Fill;
/**
 * Bord d'une forme graphique ou trait d'une ligne
 * @author Jean-Marie PETIT
 */
class Stroke extends Fill {
    /**
     * Bord d'une forme graphique ou trait d'une ligne
     * @param t épaisseur du trait
     * @param c couleur du trait entre 0x000000 et 0xFFFFFF
     * @param a transparence du trait entre 0.0 (transparent) et 1.0 (opaque)
     */
    constructor(t = 1.0, c = 0x000000, a = 1.0) {
        super(c, a);
        /**
         * stroke-linecap = "butt"|"square"|"round"
         */
        this.lineCap = "round"; //  stroke-linecap : coupé (butt), carré (square) ou arrondi (round).
        this.thickness = t;
    }
    setTo(t = 1.0, c = 0x000000, a = 1.0) {
        this.color = c;
        this.alpha = a;
        this.thickness = t;
        return this;
    }
    /**
    * épaisseur du trait
    */
    get thickness() {
        return this.val[2];
    }
    set thickness(value) {
        this.val[2] = value;
    }
}
exports.Stroke = Stroke;
/**
 * Couleur dans un dégradé
 * @author Jean-Marie PETIT
 */
class GradientStop {
    /**
     * Couleur dans un dégradé
     * @param c couleur entre 0x000000 et 0xFFFFFF
     * @param a transparence entre 0.0 (transparent) et 1.0 (opaque)
     * @param r position entre 0 et 255 (0 = début 255 = fin)
     */
    constructor(c, a, r) {
        this.color = c;
        this.alpha = a;
        this.ratio = (r / 255) * 100;
    }
    get css() {
        return Color.rgba(this.color, this.alpha) + " " + this.ratio + "%";
    }
}
exports.GradientStop = GradientStop;
/**
* Dégradé (conteneur de GradientStops)
* @author Jean-Marie PETIT
*/
class Gradient {
    /**
     * Dégradé (conteneur de GradientStops)
     * @param type type du dégradé ("linear"|"radial")
     * @param colors liste des couleurs dans l'ordre du dégradé
     * @param alphas liste des transparence dans l'ordre du dégradé
     * @param ratios positions des couleurs entre 0 et 255
     * @param angle orientation du dégradé en degrés
     */
    constructor(type, colors, alphas, ratios, angle) {
        this.clear();
        this.type = type;
        this.degres = angle;
        for (var i = 0; i < colors.length; i++) {
            this.addStop(colors[i], alphas[i], ratios[i]);
        }
    }
    /**
     * Définit l'une des positions dans le dégradé
     * @param c couleur entre 0x000000 et 0xFFFFFF
     * @param a transparence entre 0.0 (transparent) et 1.0 (opaque)
     * @param r position entre 0 et 255 (0 = début 255 = fin)
     */
    addStop(c, a, r) {
        this.stops.push(new GradientStop(c, a, r));
        this.stops.sort((a, b) => {
            return a.ratio < b.ratio ? -1 : a.ratio > b.ratio ? 1 : 0;
        });
    }
    /**
     * Supprime toutes les GradientStops du dégradé
     */
    clear() {
        this.stops = [];
    }
    /**
     * Description complète du dégradé en CSS
     */
    get css() {
        let coul = this.stops.map((s) => s.css).join(",");
        return this.type + "-gradient(" + this.degres + "deg," + coul + ")";
    }
    get svg() {
        return "";
    }
}
exports.Gradient = Gradient;
class GrElement {
    constructor(gr, type, bg) {
        this.el = document.createElementNS("http://www.w3.org/2000/svg", type);
        gr.svg.appendChild(this.el);
        this.el.id = type + "_" + gr.svg.children.length;
        if (bg) {
            if (gr.fill) {
                this.setAttr("fill", gr.fill.rgba);
            }
            else if (gr.gradient) {
                this.setAttr("fill", "#" + gr.gradient.id);
            }
        }
        else {
            this.setAttr("fill", "none");
        }
        if (gr.stroke) {
            this.setAttr("stroke", gr.stroke.rgba);
            if (gr.stroke.thickness != 1) {
                this.setAttr("stroke-width", gr.stroke.thickness);
            }
        }
    }
    setAttr(attrName, attrVal) {
        this.el.setAttribute(attrName, attrVal.toString());
    }
}
class GrCircle extends GrElement {
    constructor(gr, px, py, radius) {
        super(gr, "circle", true);
        this.circle = this.el;
        this.r = radius;
        this.x = px;
        this.y = py;
    }
    get x() {
        return this.cx - this.r;
    }
    set x(value) {
        this.cx = value + this.r;
    }
    get y() {
        return this.cy - this.r;
    }
    set y(value) {
        this.cy = value + this.r;
    }
    get cx() {
        return this.circle.cx.baseVal.value;
    }
    set cx(value) {
        this.circle.cx.baseVal.value = value;
    }
    get cy() {
        return this.circle.cy.baseVal.value;
    }
    set cy(value) {
        this.circle.cy.baseVal.value = value;
    }
    get r() {
        return this.circle.r.baseVal.value;
    }
    set r(value) {
        this.circle.r.baseVal.value = value;
    }
}
class GrEllipse extends GrElement {
    constructor(gr, x, y, width, height) {
        super(gr, "ellipse", true);
        this.ellipse = this.el;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    get x() {
        return this.cx - this.rx;
    }
    set x(value) {
        this.cx = value + this.rx;
    }
    get y() {
        return this.cy - this.ry;
    }
    set y(value) {
        this.cy = value + this.ry;
    }
    get cx() {
        return this.ellipse.cx.baseVal.value;
    }
    set cx(value) {
        this.ellipse.cx.baseVal.value = value;
    }
    get cy() {
        return this.ellipse.cy.baseVal.value;
    }
    set cy(value) {
        this.ellipse.cy.baseVal.value = value;
    }
    get rx() {
        return this.ellipse.rx.baseVal.value;
    }
    set rx(value) {
        this.ellipse.rx.baseVal.value = value;
    }
    get ry() {
        return this.ellipse.ry.baseVal.value;
    }
    set ry(value) {
        this.ellipse.ry.baseVal.value = value;
    }
    get width() {
        return this.rx * 2;
    }
    set width(value) {
        this.rx = value / 2;
    }
    get height() {
        return this.ry * 2;
    }
    set height(value) {
        this.ry = value / 2;
    }
}
class GrLine extends GrElement {
    constructor(gr, px, py, x, y) {
        super(gr, "line", false);
        this.line = this.el;
        this.x1 = px;
        this.y1 = py;
        this.x2 = x;
        this.y2 = y;
    }
    get x1() {
        return this.line.x1.baseVal.value;
    }
    set x1(value) {
        this.line.x1.baseVal.value = value;
    }
    get y1() {
        return this.line.y1.baseVal.value;
    }
    set y1(value) {
        this.line.y1.baseVal.value = value;
    }
    get x2() {
        return this.line.x2.baseVal.value;
    }
    set x2(value) {
        this.line.x2.baseVal.value = value;
    }
    get y2() {
        return this.line.y2.baseVal.value;
    }
    set y2(value) {
        this.line.y2.baseVal.value = value;
    }
}
class GrPolyline extends GrElement {
    constructor(gr, startX, startY, points) {
        super(gr, "polyline", false);
        this.lines = this.el;
        this.setAttr("points", startX + " " + startY + " " + points.join(" "));
    }
}
class GrPath extends GrElement {
    constructor(gr, close, cmd) {
        super(gr, "path", close);
        this.command = cmd;
        this.setAttr("d", this.command);
    }
    get command() {
        return this.el.getAttribute("d");
    }
    set command(value) {
        this.el.setAttribute("d", value);
    }
    /**
     * M = moveto
     */
    moveTo(x, y) {
        let cmd = this.command;
        this.command = cmd + ` M ${x} ${y}`;
    }
    /**
     * L = lineto
     */
    lineTo(bAbs, x, y) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "L" : "l"} ${x} ${y}`;
    }
    /**
    * H = horizontal lineto
    */
    hLineTo(bAbs, x) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "H" : "h"} ${x}`;
    }
    /**
    * V = vertical lineto
    */
    vLineTo(bAbs, y) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "V" : "v"} ${y}`;
    }
    /**
    * C = curveto
    */
    cubicCurveTo(bAbs, ax1, ay1, ax2, ay2, x, y) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "C" : "c"} ${ax1} ${ay1} ${ax2} ${ay2} ${x} ${y}`;
    }
    /**
    * S = smooth curveto
    */
    smoothCubicCurveTo(bAbs, ax1, ay1, ax2, ay2, x, y) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "S" : "s"} ${x} ${y}`;
    }
    /**
    * Q = quadratic Bézier curve
    */
    quadraticCurveTo(bAbs, ax, ay, x, y) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "Q" : "q"} ${ax} ${ay} ${x} ${y}`;
    }
    /**
    * T = smooth quadratic Bézier curveto
    */
    smoothQuadraticCurveTo(bAbs, ax, ay, x, y) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "T" : "t"} ${ax} ${ay} ${x} ${y}`;
    }
    /**
   * A = elliptical Arc
   */
    ellipticalArc(bAbs, x, y) {
        let cmd = this.command;
        this.command = cmd + ` ${bAbs ? "A" : "a"} ${x} ${y}`;
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
    constructor(gr, points) {
        super(gr, "polygon", true);
        this.lines = this.el;
        this.setAttr("points", points.join(" "));
    }
}
class GrRect extends GrElement {
    constructor(gr, px, py, w, h, xRadius, yRadius) {
        super(gr, "rect", true);
        this.rect = this.el;
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
    get x() {
        return this.rect.x.baseVal.value;
    }
    set x(value) {
        this.rect.x.baseVal.value = value;
    }
    get y() {
        return this.rect.y.baseVal.value;
    }
    set y(value) {
        this.rect.y.baseVal.value = value;
    }
    get rx() {
        return this.rect.rx.baseVal.value;
    }
    set rx(value) {
        this.rect.rx.baseVal.value = value;
    }
    get ry() {
        return this.rect.ry.baseVal.value;
    }
    set ry(value) {
        this.rect.ry.baseVal.value = value;
    }
    get width() {
        return this.rect.width.baseVal.value;
    }
    set width(value) {
        this.rect.width.baseVal.value = value;
    }
    get height() {
        return this.rect.width.baseVal.value;
    }
    set height(value) {
        this.rect.width.baseVal.value = value;
    }
}
/**
 * Commandes graphiques
 * associées à un DisplayObject (Sprite, Shape,...)
 * @author Jean-Marie PETIT
 */
class Graphics {
    constructor(disp, el) {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.style.pointerEvents = "none";
        el.appendChild(this.svg);
        this.svg.setAttribute("width", "100%");
        this.svg.setAttribute("height", "100%");
        this.clear();
    }
    clear() {
        this.fill = null;
        this.stroke = null;
        this.gradient = null;
        while (this.svg.lastChild) {
            this.svg.removeChild(this.svg.lastChild);
        }
        this.x = 0;
        this.y = 0;
    }
    beginFill(color, alpha = 1.0) {
        this.gradient = null;
        if (color != undefined) {
            this.fill = new Fill(color, alpha);
        }
        else {
            this.fill = null;
        }
    }
    beginGradientFill(type, colors, alphas, ratios, angle) {
        this.fill = null;
        this.gradient = new Gradient(type, colors, alphas, ratios, angle);
    }
    drawCircle(x, y, radius) {
        const draw = new GrCircle(this, x, y, radius);
        this.x = x;
        this.y = y;
    }
    drawEllipse(x, y, width, height) {
        const draw = new GrEllipse(this, x, y, width, height);
        this.x = x;
        this.y = y;
    }
    drawPolygon(...num) {
        const draw = new GrPolygone(this, num);
        this.x = num[num.length - 2];
        this.y = num[num.length - 1];
    }
    drawRect(x, y, width, height) {
        const draw = new GrRect(this, x, y, width, height);
        this.x = x;
        this.y = y;
    }
    drawRoundRect(x, y, width, height, xRadius, yRadius) {
        const draw = new GrRect(this, x, y, width, height, xRadius, yRadius);
        this.x = x;
        this.y = y;
    }
    cubicCurveTo(ax1, ay1, ax2, ay2, x, y) {
        const draw = new GrPath(this, false, ` M ${this.x} ${this.y}`);
        draw.cubicCurveTo(true, ax1, ay1, ax2, ay2, x, y);
        this.x = x;
        this.y = y;
    }
    curveTo(ax, ay, x, y) {
        const draw = new GrPath(this, false, ` M ${this.x} ${this.y}`);
        draw.quadraticCurveTo(true, ax, ay, x, y);
        this.x = x;
        this.y = y;
    }
    endFill() {
    }
    lineStyle(thickness, color, alpha) {
        this.stroke = (color != undefined) ?
            new Stroke(thickness, color, alpha) : null;
    }
    lineTo(x, y) {
        const line = new GrLine(this, this.x, this.y, x, y);
        this.x = x;
        this.y = y;
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.Graphics = Graphics;
//# sourceMappingURL=graph.js.map