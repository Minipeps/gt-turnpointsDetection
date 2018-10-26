/*jshint esversion: 6 */
function Point(x, y) {
    this.x = x;
    this.y = y;

    this.display = function() {
        stroke(255);
        fill(255);
        ellipse(this.x, this.y, 10);
    };

    this.distanceToPoint = function(other) {
        return sqrt(pow(this.x - other.x, 2) + pow(this.y - other.y, 2));
    };

    this.distanceToSegment = function(a, b) {
        var num = (this.x - a.x)*(b.x - a.x) + (this.y - a.y)*(b.y - a.y);
        var den = pow(b.x - a.x, 2) + pow(b.y - a.y, 2);
        var t = num / den;
        var c = new Point(a.x + t*(b.x - a.x), a.y + t*(b.y - a.y));
        return this.distanceToPoint(c);
    };
}