const Shapes = require('./Shape').Shapes;
const Point = require('./Shape.js').Point;
const Shape = require('./Shape.js').Shape;
const Rectangle = require('./Shape.js').Rectangle;
const Ellipse = require('./Shape.js').Ellipse;
const Circle = require('./Shape.js').Circle;
const Square = require('./Shape.js').Square;
var assert = require('assert');


let points = -1;

before(() => {
    points = 0;
})

describe("Testing shapes classes", () => {
    it('can create Point & toString() return value expected', () => {
        const p = new Point();
        assert.equal(p.toString(), "(0,0)");
        points++;
    });
    it('can create Rectangle & toString() return value expected', () => {
        const r = new Rectangle("RE", new Point(12, 34), 56, 78);
        let str = "name: RE, location: (12,34), w: 56, h: 78".replace(/\s/g, "").toLowerCase();
        assert.equal(r.toString().replace(/\s/g, "").toLowerCase(), str);
        points++;
    });
    it('can create Ellipse & toString() return value expected', () => {
        const r = new Ellipse("RE", new Point(12, 34), 56, 78);
        let str = "name: RE, location: (12,34), a: 56, b: 78".replace(/\s/g, "").toLowerCase();
        assert.equal(r.toString().replace(/\s/g, "").toLowerCase(), str);
        points++;
    });
    it('can create Square & toString() return value expected', () => {
        const sq = new Square("SQ", new Point(12, 34), 56);
        let str = "name: SQ, location: (12,34), w: 56, h: 56".replace(/\s/g, "").toLowerCase();
        assert.equal(sq.toString().replace(/\s/g, "").toLowerCase(), str);
        points++;
    });
    it('can create Circle & toString() return value expected', () => {
        const sq = new Circle("SQ", new Point(12, 34), 56);
        let str = "name: SQ, location: (12,34), a: 56, b: 56".replace(/\s/g, "").toLowerCase();
        assert.equal(sq.toString().replace(/\s/g, "").toLowerCase(), str);
        points++;
    });
    it('can create & use Shapes: add(Shape) / remove(name) / remove(Point)', () => {
        const shapes = new Shapes();
        shapes.add(new Rectangle("RE", new Point(1, 2), 34, 56));
        let sh = shapes.remove("RE");
        assert.equal(sh instanceof Rectangle, true, "Removed should be instance of Rectangle");
        points++;
        shapes.add(new Rectangle("RE2", new Point(1, 2), 34, 56));
        sh = shapes.remove("RE");
        assert.equal(sh instanceof Rectangle, false, "Removed should not be instance of Rectangle");
        points++;
        shapes.add(new Ellipse("E1", new Point(1, 2), 34, 56));
        shapes.add(new Ellipse("E1", new Point(1, 2), 34, 56));
        sh = shapes.remove("E1");
        assert.equal(sh instanceof Ellipse, true, "Removed should be instance of Ellipse");
        points++;
        sh = shapes.remove("E1");
        assert.equal(sh instanceof Ellipse, false, "Removed should not be instance of Ellipse");
        points++;
        shapes.add(new Ellipse("E2", new Point(10, 20), 34, 56));
        sh = shapes.remove2(new Point(10, 20));
        assert.equal(sh instanceof Ellipse, true, "Removed by Point should be instance of Ellipse");
        points++;
        shapes.add(new Circle("SQ1", new Point(110, 220), 34, 56));
        shapes.add(new Square("SQ2", new Point(111, 221), 34, 56));
        shapes.add(new Circle("SQ3", new Point(112, 222), 34, 56));
        sh = shapes.remove("SQ2");
        assert.equal(sh instanceof Square, true, "Removed should be instance of Square");
        points++;
        sh = shapes.remove("SQ2");
        assert.equal(sh instanceof Square, false, "Removed should not be instance of Square");
        points++;
        sh = shapes.remove("SQ1");
        assert.equal(sh instanceof Circle, true, "Removed should be instance of Circle");
        points++;
        sh = shapes.remove2(new Point(112, 222));
        assert.equal(sh instanceof Circle, true, "Removed by Point should be instance of Circle");
        points++;

    });
});
after(() => {
    console.log("final points: " + points);
})
