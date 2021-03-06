/*jshint esversion: 6 */
/**
 * @class Class representing a 2D point.
 */
class Point {

    /**
     * Create a point with the given 2D coordinates.
     * @constructor
     * @param {int} x - Coordinate for the horizontal axis.
     * @param {int} y - Coordinate for the vertical axis.
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Draw the point on the current p5 canvas.
     */
    display() {
        stroke(255);
        fill(255);
        ellipse(this.x, this.y, 10);
    }

    /**
     * Calculate the distance from this point to another.
     * @param {Point} other 
     * @returns {number} The distance between the two points.
     */
    distanceToPoint(other) {
        return sqrt(pow(this.x - other.x, 2) + pow(this.y - other.y, 2));
    }

    /**
     * Calculate the distance between this point and the segment [a, b]
     * using orthogonal projection.
     * @param {Point} a - One end of the segment.
     * @param {Point} b - The other end of the segment.
     * @returns {number} The point to segment distance.
     */
    distanceToSegment(a, b) {
        var num = (this.x - a.x)*(b.x - a.x) + (this.y - a.y)*(b.y - a.y);
        var den = pow(b.x - a.x, 2) + pow(b.y - a.y, 2);
        var t = num / den;
        var c = new Point(a.x + t*(b.x - a.x), a.y + t*(b.y - a.y));
        return this.distanceToPoint(c);
    }
}