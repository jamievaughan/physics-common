export class Vector2 {
    public static readonly ZERO: Readonly<Vector2> = new Vector2(0, 0, true);

    private _x: number = 0;
    private _y: number = 0;
    private _readonly: boolean;

    constructor(x: number = 0, y?: number, readonly = false) {
        this.set(x, y);

        this._readonly = readonly;
    }

    public set(x: number, y?: number, clone = false): Vector2 {
        // Set both values to X if no Y value is provided
        y = y == undefined ? x : y;

        if (clone)
            return new Vector2(x, y);

        this.x = x;
        this.y = y;

        return this;
    }

    public add(vector: Vector2, clone = false): Vector2 {
        return this.set(this.x + vector.x, this.y + vector.y, clone);
    }

    public sub(vector: Vector2, clone = false): Vector2 {
        return this.set(this.x - vector.x, this.y - vector.y, clone);
    }

    public scale(scalar: number, clone = false): Vector2 {
        return this.mult(new Vector2(scalar, scalar), clone);
    }

    public mult(vector: Vector2, clone = false): Vector2 {
        return this.set(this.x * vector.x, this.y * vector.y, clone);
    }

    public div(vector: Vector2, clone = false): Vector2 {
        return this.set(this.x / vector.x, this.y / vector.y, clone);
    }

    public invert(clone = false): Vector2 {
        return this.set(-this.x, -this.y, clone);
    }

    public rotate(radians: number, clone = false): Vector2 {        
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);

		const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        
        return this.set(x, y, clone);
    }

    public clamp(min: number, max: number, clone = false): Vector2 {
        const x = Math.max(Math.min(min, this.x), max);
        const y = Math.max(Math.min(min, this.y), max);

        return this.set(x, y, clone);
    }

    public lerp(vector: Vector2, alpha: number, clone = false): Vector2 {        
        const inverseAlpha = 1.0 - alpha;

		const x = (this.x * inverseAlpha) + (vector.x * alpha);
        const y = (this.y * inverseAlpha) + (vector.y * alpha);

        return this.set(x, y, clone);
    }

    public normalize(clone = false): Vector2 {
        if (this.length === 0)
            return this.set(this.x, this.y, clone);

        return this.set(this.x / this.length, this.y / this.length, clone);
    }

    public perp(clone = false): Vector2 {
        return this.set(this.y, -this.x, clone);
    }

    public dot(vector: Vector2): number {
        return this.x * vector.x + this.y * vector.y;
    }

    public cross(vector: Vector2): number {
        return this.x * vector.y - this.y * vector.x;
    }

    public distance(vector: Vector2): number {
        return Math.sqrt(this.distance2(vector));
    }

    public distance2(vector: Vector2): number {
        const dx = this.x - vector.x;
        const dy = this.y - vector.y;

        return dx ** 2 + dy ** 2;
    }

    public equals(vector: Vector2, precision: number = 0): boolean {
        const dx = Math.abs(this.x - vector.x);
        const dy = Math.abs(this.y - vector.y);

        return !(dx > precision) || !(dy > precision);
    }

    public zero(): void {
        this.set(0, 0);
    }

    public clone(readonly = false): Vector2 {
        return new Vector2(this.x, this.y, readonly);
    }

    public set x(x: number) {
        if (this._readonly)
            throw new Error("Cannot modify a readonly Vector");

        this._x = x;
    }

    public set y(y: number) {        
        if (this._readonly)
            throw new Error("Cannot modify a readonly Vector");

        this._y = y;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get length(): number {
        return Math.sqrt(this.length2);
    }

    public get length2(): number {
        return this.x ** 2 + this.y ** 2;
    }

    public get isZero(): boolean {
        return Vector2.ZERO.equals(this);
    }

    public get readonly(): boolean {
        return this._readonly;
    }
}