import { AABB } from '../../math';

import { Quadrant } from './Quadrant';
import { QuadtreeMap } from './QuadtreeMap';

const DEFAULT_MIN_ENTITIES = 3;
const DEFAULT_MAX_ENTITIES = 4;
const DEFAULT_MAX_DEPTH = 5;

export interface QuadtreeProperties {
    readonly bounds: AABB;
    readonly minEntities?: number;
    readonly maxEntities?: number;
    readonly maxDepth?: number;
}

export class Quadtree<TEntity> {
    private readonly _map = new QuadtreeMap<TEntity>();
    private readonly _root: Quadrant<TEntity>;

    constructor(properties: QuadtreeProperties) {
        if (!properties)
            throw new Error("Quadtree must have valid properties");

        if (!properties.bounds || !properties.bounds.valid)
            throw new Error("Quadtree boundaries must be valid");

        if (properties.minEntities && properties.minEntities <= 0)
            throw new Error("Minimum entities must be greater than zero");

        if (properties.maxEntities && properties.minEntities && properties.minEntities >= properties.maxEntities)
            throw new Error("Minimum entities must be less than maximum entities");

        this._root = new Quadrant<TEntity>({
            map: this._map,
            bounds: properties.bounds,
            minEntities: properties.minEntities || DEFAULT_MIN_ENTITIES,
            maxEntities: properties.maxEntities || DEFAULT_MAX_ENTITIES,
            maxDepth: properties.maxDepth || DEFAULT_MAX_DEPTH
        });
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