import { AABB } from '../../math';

import { Quadrant } from './Quadrant';
import { QuadtreeMap } from './QuadtreeMap';

const DEFAULT_MIN_ENTITIES = 3;
const DEFAULT_MAX_ENTITIES = 3;

export class Quadtree<TEntity> {
    private readonly _map = new QuadtreeMap<TEntity>();
    private readonly _root: Quadrant<TEntity>;

    constructor(bounds: AABB, minEntities = DEFAULT_MIN_ENTITIES, maxEntities = DEFAULT_MAX_ENTITIES) {
        if (!bounds || !bounds.valid)
            throw new Error("Quadtree boundaries must be valid");

        if (minEntities <= 0 || minEntities >= maxEntities)
            throw new Error("Minimum entities must be above zero and less than the maximum");

        this._root = new Quadrant<TEntity>(this._map, bounds, minEntities, maxEntities);
    }

    public insert(entity: TEntity, bounds: AABB): void {
        if (!entity)
            throw new Error("Entity must be defined");

        if (!bounds || !bounds.valid)
            throw new Error("Entity boundaries must be valid");

        this._root.insert(entity, bounds);
    }

    public remove(entity: TEntity): void {
        if (!entity)
            throw new Error("Entity must be defined");

        const quadrants = this._map.get(entity);
        if (!quadrants)
            return;

        for (const quadrant of quadrants)
            quadrant.remove(entity);
    }

    public update(entity: TEntity, newBounds?: AABB): void {
        if (!entity)
            throw new Error("Entity must be defined");
  
        if (newBounds && !newBounds.valid)
            throw new Error("Entity's new boundaries must be valid");

        const quadrants = this._map.get(entity);
        if (!quadrants)
            return;

        for (const quadrant of quadrants)
            quadrant.update(entity, newBounds);
    }
    
    public intersections(entity: TEntity): TEntity[] {
        if (!entity)
            throw new Error("Entity must be defined");

        const entities: TEntity[] = [];

        const quadrants = this._map.get(entity);
        if (quadrants) {
            for (const quadrant of quadrants)
                entities.push(...quadrant.intersections(entity));
        }

        return entities;
    }

    public contains(entity: TEntity): boolean {
        return this._map.exists(entity);
    }

    public clear(): void {
        this._root.clear();
    }

    public get root(): Quadrant<TEntity> {
        return this._root;
    }
}