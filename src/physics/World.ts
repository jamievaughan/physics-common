import { Body } from './body';
import { AABB } from '../math';
import { Quadtree } from '../graph';

export class World {
    private readonly _tree: Quadtree<Body>;
    private _bodies: Body[] = [];

    constructor(aabb: AABB) {
        this._tree = new Quadtree<Body>({
            bounds: aabb,
            minEntities: 3,
            maxEntities: 4,
            maxDepth: 5
        });
    }

    public add(body: Body): void {
        this._bodies.push(body);
        this._tree.insert(body, body.shape.aabb);
    }

    public remove(body: Body): boolean {
        const index = this._bodies.indexOf(body);
        if (!~index)
            return false;

        this._bodies.splice(index, 1);
        this._tree.remove(body);

        return true;
    }

    public clear(): void {
        this._bodies = [];
        this._tree.clear();
    }

    public get tree(): Quadtree<Body> {
        return this._tree;
    }

    public get bodies(): ReadonlyArray<Body> {
        return this._bodies;
    }
}