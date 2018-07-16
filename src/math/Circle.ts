export class Circle {
    public x: number = 0;
    public y: number = 0;
    public radius: number = 0;

    constructor(x: number = 0, y: number = 0, radius: number = 0) {
        this.set(x, y, radius);
    }

    public set(x: number, y: number, radius: number): void {
        this.position(x, y);

        this.radius = radius;
    }

    public translate(x: number, y: number): void {
        this.position(this.x + x, this.y + y);
    }

    public position(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public intersects(other: Circle): boolean {
        const distance2 = this.distance2(other.x, other.y);
        const radii = (other.radius + this.radius) ** 2;

        return distance2 <= radii;
    }

    public containsPoint(x: number, y: number): boolean {
        const distance2 = this.distance2(x, y);
        const radii = this.radius ** 2;

        return distance2 <= radii;
    }

    public contains(other: Circle): boolean {
        if (other.radius >= this.radius)
            return false;

        const distance2 = this.distance2(other.x, other.y);
        const radii = (this.radius - other.radius) ** 2;

        return radii < distance2;
    }

    private distance2(x: number, y: number): number {
        const dx = this.x - x;
        const dy = this.y - y;

        return (dx * dx) + (dy * dy);
    }

    public clone(): Circle {
        return new Circle(this.x, this.y, this.radius);
    }

    public get diameter(): number {
        return this.radius * 2;
    }

    public get perimeter(): number {
        return this.diameter * Math.PI;
    }

    public get area(): number {
        return (this.radius ** 2) * Math.PI;
    }

    public get valid(): boolean {
        return this.radius > 0;
    }
}