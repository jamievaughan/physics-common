import { AABB } from './AABB';
import { Vector2 } from './Vector2';

import * as _ from 'lodash';

export class Polygon {
    private readonly _aabb = new AABB();
    private readonly _center = new Vector2();

    private _vertices: Vector2[] = [];
    private _normals: Vector2[] = [];
    private _area: number = 0;

    constructor(vertices: Vector2[] = []) {
        this.set(vertices);
    }

    public set(vertices: Vector2[]): void {
        this._vertices = vertices;

        this.update();
    }

    public push(...vertices: Vector2[]): void {        
        this._vertices.push(...vertices);

        this.update();
    }

    public insert(index: number, ...vertices: Vector2[]): void {
        this._vertices.splice(index, 0, ...vertices);

        this.update();
    }

    public remove(index: number): boolean {
        if (index < 0 || index >= this._vertices.length)
            return false;

        this._vertices.splice(index, 1);

        this.update();

        return true;
    }

    public clear(): void {
        this._aabb.inf();
        this._center.zero();

        this._vertices = [];
        this._normals = [];
        this._area = 0;
    }

    public translate(x: number, y: number): void {
        const translation = new Vector2(x, y);

        for (const vertex of this._vertices)
            vertex.add(translation);

        // Translate the AABB and the center
        this._aabb.translate(translation.x, translation.y);
        this._center.add(translation);
    }

    public scale(scale: number, origin?: Vector2): void {
        origin = origin || this._center;

        const diff = origin.scale(scale, true).sub(origin);

        for (const vertex of this._vertices)
            vertex.scale(scale).sub(diff);

        this.update();
    }

    public rotate(degrees: number, origin?: Vector2): void {
        origin = origin || this._center;

        const radians = degrees * Math.PI / 180;

        for (const vertex of this._vertices)
            vertex.sub(origin).rotate(radians).add(origin);

        this.update();
    }

    public rewind(): void {
        this._vertices.reverse();
        this._normals.reverse();
    }

    public containsPoint(x: number, y: number): boolean {
        if (!this._aabb.containsPoint(x, y))
            return false;

        let result = false;

        this._vertices.forEach((vertex, index) => {
            const prev = index === 0
                ? vertex
                : this._vertices[index - 1];

            // TODO: Refactor
            (((prev.y <= y && y < vertex.y) || (vertex.y <= y && y < prev.y))
                && (x < (vertex.x - prev.x) * (y - prev.y) / (vertex.y - prev.y) + prev.x))
                && (result = !result);
        });

        return result;
    }

    public contains(other: Polygon): boolean {
        if (!this._aabb.contains(other._aabb))
            return false;

        // This polygon must contain all other points
        for (const vertex of other._vertices) {
            if (!this.containsPoint(vertex.x, vertex.y))
                return false;
        }

        return true;
    }

    public intersects(other: Polygon): boolean {
        if (!this._aabb.intersects(other._aabb))
            return false;

        // At least one point must be within this polygon
        for (const vertex of other._vertices) {
            if (this.containsPoint(vertex.x, vertex.y))
                return true;
        }

        return false;
    }

    public project(axis: Vector2, transform = new Vector2()): Vector2 {
        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;

        for (const vertex of this._vertices) {
            const projection = vertex
                .add(transform, true)
                .dot(axis);

            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }

        return new Vector2(min, max);
    }

    private update(): void {
        this._aabb.inf();
        this._center.zero();

        this._area = 0;
        this._normals = [];

        if (!this.valid)
            return;

        // TODO: Split this up, but maintain a single vertices iteration
        this._vertices.forEach((vertex, index) => {
            // Extend the AABB to contain the vertex
            this._aabb.extend(vertex.x, vertex.y);

            const first = this._vertices[0];
            const current = this._vertices[index];
            const next = this._vertices[index + 1] || first;

            // Calculate the normal for this vertex
            this._normals[index] = current
                .sub(next, true)
                .perp()
                .normalize();

            if (index < 2)
                return;

            const prev = this._vertices[index - 1];

            // Accumulate the area value
            const edge1 = first.sub(vertex, true);
            const edge2 = first.sub(prev, true);

            this._area += edge1.cross(edge2);
        });

        this._area /= 2;

        // TODO: The AABB center is not the true center of the polygon
        this._center.set(this._aabb.centerX, this._aabb.centerY);
    }

    public clone(): Polygon {
        const vertices = _.cloneDeep(this._vertices);
        return new Polygon(vertices);
    }

    public get vertices(): ReadonlyArray<Vector2> {
        return this._vertices;
    }

    public get length(): number {
        return this._vertices.length;
    }

    public get aabb(): Readonly<AABB> {
        return this._aabb;
    }

    public get normals(): ReadonlyArray<Vector2> {
        return this._normals;
    }

    public get area(): number {
        return this._area;
    }

    public get centerX(): number {
        return this._center.x;
    }

    public get centerY(): number {
        return this._center.y;
    }

    public get center(): Vector2 { // TODO: Readonly
        return this._center;
    }

    public get valid(): boolean {
        return this._vertices.length > 2;
    }
}