"use strict";
class Point {
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }
    ;
    setX(x) {
        this._x = x;
    }
    ;
    getX() {
        return this._x;
    }
    ;
    setY(y) {
        this._y = y;
    }
    ;
    getY() {
        return this._y;
    }
    ;
    toString() {
        return (`(${this._x},${this._y})`);
    }
    ;
}
;
//------- SHAPE -----------------------------------
class Shape {
    constructor(name, location) {
        this._name = name;
        this._location = location;
    }
    ;
    setName(name) {
        this._name = name;
    }
    ;
    getName() {
        return this._name;
    }
    ;
    setLocation(location) {
        this._location = location;
    }
    ;
    getLocation() {
        return this._location;
    }
    ;
    toString() {
        return (`name: ${this._name}, location: ${this._location.toString()}, `);
    }
    ;
}
;
//------- RECTANGLE -----------------------------------
class Rectangle extends Shape {
    constructor(name, location, width, height) {
        super(name, location);
        this._width = width;
        this._height = height;
    }
    ;
    setWidth(width) {
        this._width = width;
    }
    ;
    getWidth() {
        return this._width;
    }
    ;
    setHeight(height) {
        this._height = height;
    }
    ;
    getHeight() {
        return this._height;
    }
    ;
    toString() {
        return super.toString() +
            `w: ${this._width}, h: ${this._height}`;
    }
    ;
    draw() {
        for (let i = 0; i < this._height; i++) {
            console.log("*".repeat(this._width));
        }
        ;
    }
    ;
}
;
//------- ELLIPSE -----------------------------------
class Ellipse extends Shape {
    constructor(name, location, width, height) {
        super(name, location);
        this._width = width;
        this._height = height;
    }
    ;
    setWidth(width) {
        this._width = width;
    }
    ;
    getWidth() {
        return this._width;
    }
    ;
    setHeight(height) {
        this._height = height;
    }
    ;
    getHeight() {
        return this._height;
    }
    ;
    toString() {
        return super.toString() +
            `a: ${this._width}, b: ${this._height}`;
    }
    ;
    draw() {
        for (let y = 0; y < this._height; y++) {
            let row = "";
            for (let x = 0; x < this._width; x++) {
                // Ellipsin yhtälö: (x - h)^2 / a^2 + (y - k)^2 / b^2 <= 1
                // Keskipiste (h, k) on (width / 2, height / 2)
                let h = this._width / 2;
                let k = this._height / 2;
                let a = this._width / 2;
                let b = this._height / 2;
                if (Math.pow((x - h) / a, 2) + Math.pow((y - k) / b, 2) <= 1) {
                    row += "*";
                }
                else {
                    row += " ";
                }
            }
            ;
            console.log(row);
        }
        ;
    }
    ;
}
;
//------- SQUARE -----------------------------------
class Square extends Rectangle {
    constructor(name, location, width, height) {
        if (height === undefined) {
            super(name, location, width, width);
        }
        else {
            super(name, location, width, height);
        }
        ;
    }
    ;
}
;
//------- CIRCLE -----------------------------------
class Circle extends Ellipse {
    constructor(name, location, width, height) {
        if (height === undefined) {
            super(name, location, width, width);
        }
        else {
            super(name, location, width, width);
        }
        ;
    }
    ;
}
;
//------- SHAPES -----------------------------------
// this class can contain all created shapes using name as key
class Shapes {
    constructor() {
        this.shapes = new Map();
    }
    ;
    add(s) {
        // check if shape of same name already exists:
        let already_exists = this.shapes.get(s.getName());
        // if not, just add new one and return undefined
        if (already_exists === undefined) {
            this.shapes.set(s.getName(), s);
            return undefined;
        }
        // if exists, return old shape after adding new
        else {
            let old_shape = this.shapes.get(s.getName());
            this.shapes.delete(s.getName());
            this.shapes.set(s.getName(), s);
            return old_shape;
        }
        ;
    }
    ;
    remove(name) {
        // if removable shape doesn't exist, return undefined
        let already_exists = this.shapes.get(name);
        if (already_exists === undefined) {
            return undefined;
        }
        else {
            this.shapes.delete(name);
            return already_exists;
        }
        ;
    }
    ;
    remove2(p) {
        for (let [name, shape] of this.shapes) {
            // if find a shape on point (x,y), return and delete it
            if (shape.getLocation().getX() === p.getX() && shape.getLocation().getY() === p.getY()) {
                let removable_shape = this.shapes.get(shape.getName());
                this.shapes.delete(shape.getName());
                return removable_shape;
            }
        }
        ;
        // shape was not found, return undefined
        return undefined;
    }
    ;
    drawall() {
        console.log("********** START **********");
        this.shapes.forEach((s, name) => {
            s.draw();
        });
        console.log("*********** END ***********");
    }
    ;
}
;
/*
const shapes = new Shapes();

const r = new Rectangle("RE", new Point(12, 34), 56, 78);
console.log(r.toString());


shapes.add(new Rectangle("RE", new Point(1, 2), 34, 56));
let sh = shapes.remove("RE");
console.log(sh instanceof Rectangle);

shapes.add(new Rectangle("RE2", new Point(1, 2), 34, 56));
sh = shapes.remove("RE");
console.log(sh instanceof Rectangle);

shapes.add(new Ellipse("E1", new Point(1, 2), 34, 56));
shapes.add(new Ellipse("E1", new Point(1, 2), 34, 56));
sh = shapes.remove("E1");
console.log(sh instanceof Ellipse);

sh = shapes.remove("E1");
console.log(sh instanceof Ellipse);

let e2 = new Ellipse("E2", new Point(10, 20), 34, 56)
shapes.add(e2);
console.log(e2.getLocation())

let sh = shapes.remove2(new Point(10, 20));
console.log(sh instanceof Ellipse);


shapes.add(new Circle("SQ1", new Point(110, 220), 34, 56));
shapes.add(new Square("SQ2", new Point(111, 221), 34, 56));
shapes.add(new Circle("SQ3", new Point(112, 222), 34, 56));
let sh = shapes.remove("SQ2");
console.log(sh instanceof Square);

sh = shapes.remove("SQ2");
console.log(sh instanceof Square);

sh = shapes.remove("SQ1");
console.log(sh instanceof Circle);

sh = shapes.remove2(new Point(112, 222));
console.log(sh instanceof Circle);

sh = shapes.remove2(new Point(112, 222));
console.log(sh instanceof Circle);
*/
module.exports = { Point, Shape, Rectangle, Ellipse, Square, Circle, Shapes };
