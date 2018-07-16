export class AABB {
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.set(x, y, width, height);
    }

    public set(x: number, y: number, width: number, height: number): void {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public position(x: number, y: number): void {
        this.set(x, y, this.width, this.height);
    }

    public dimensions(width: number, height: number): void {
        this.set(this.x, this.y, width, height);
    }

    public translate(x: number, y: number): void {
        this.position(this.x + x, this.y + y);
    }

    public extend(x: number, y: number): void {
        const minX = Math.min(this.x, x);
        const minY = Math.min(this.y, y);

        const maxX = Math.max(this.x + this.width, x);
        const maxY = Math.max(this.y + this.height, y);

        this.set(minX, minY, maxX - minX, maxY - minY);
    }

    public expand(width: number, height: number): void {
        this.dimensions(this.width + width, this.height + height);
    }

    public clear(): void {
        this.set(0, 0, 0, 0);
    }

    public inf(): void {
        this.set(
            Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER,
            Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
    }

    public merge(other: AABB): void {
        const x = Math.min(this.x, other.x);
        const y = Math.min (this.y, other.y);
        const width = Math.max(this.width, other.width);
        const height = Math.max(this.height, other.height);

        this.set(x, y, width, height);
    }

    public intersects(other: AABB): boolean {
        return this.x < other.x + other.width && this.x + this.width > other.x
            && this.y < other.y + other.height && this.y + this.height > other.y;
    }

    public containsPoint(x: number, y: number): boolean {
        return x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height;
    }

    public contains(other: AABB): boolean {
        return other.x >= this.x && other.y >= this.y
            && other.x + other.width <= this.x + this.width
            && other.y + other.height <= this.y + this.height;
    }

    public clone(): AABB {
        return new AABB(this.x, this.y, this.width, this.height);
    }

    public get centerX(): number {
        return this.x + (this.width / 2);
    }

    public get centerY(): number {
        return this.y + (this.height / 2);
    }

    public get left(): number {
        return this.x;
    }

    public get right(): number {
        return this.x + this.width;
    }

    public get top(): number {
        return this.y + this.height;
    }

    public get bottom(): number {
        return this.y;
    }

    public get valid(): boolean {
        return this.width > 0 && this.height > 0;
    }
}