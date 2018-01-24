"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geom_1 = require("./geom");
class Color {
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
        this.thickness = t;
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
    get css() {
        let coul = this.stops.map((s) => s.css).join(",");
        return this.type + "-gradient(" + this.degres + "deg," + coul + ")";
    }
}
exports.Gradient = Gradient;
/**
 * Commandes graphiques
 * associées à un DisplayObject (Sprite, Shape,...)
 * @author Jean-Marie PETIT
 */
class Graphics {
    constructor(e) {
        this.el = e;
        this._pos = new geom_1.Point(0, 0);
    }
    clear() {
        this.fill = null;
        this.stroke = null;
        this.gradient = null;
        this._pos = new geom_1.Point(0, 0);
    }
    beginFill(color, alpha = 1.0) {
        if (color != undefined) {
            this.fill = new Fill(color, alpha);
        }
        else {
            this.fill = null;
        }
    }
    beginGradientFill(type, colors, alphas, ratios, angle) {
        this.gradient = new Gradient(type, colors, alphas, ratios, angle);
    }
    drawCircle(x, y, radius) {
        this._pos.setTo(x, y);
    }
    drawEllipse(x, y, width, height) {
        this._pos.setTo(x, y);
    }
    drawRect(x, y, width, height) {
        this._pos.setTo(x, y);
    }
    drawRoundRect(x, y, width, height, xRadius, yRadius) {
        this._pos.setTo(x, y);
    }
    cubicCurveTo(ax1, ay1, ax2, ay2, x, y) {
        this._pos.setTo(x, y);
    }
    curveTo(ax, ay, x, y) {
        this._pos.setTo(x, y);
    }
    endFill() {
    }
    lineStyle(thickness, color, alpha) {
        this.stroke = (color != undefined) ?
            new Stroke(thickness, color, alpha) : null;
    }
    lineTo(x, y) {
        this._pos.setTo(x, y);
    }
    moveTo(x, y) {
        this._pos.setTo(x, y);
    }
}
exports.Graphics = Graphics;
//# sourceMappingURL=graph.js.map