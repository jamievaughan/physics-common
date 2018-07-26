import { AABB } from '../../math';
import { QuadrantEntry } from './QuadrantEntry';
import { QuadtreeMap } from './QuadtreeMap';

export interface QuadrantProperties<TEntity> {
    readonly map: QuadtreeMap<TEntity>;
    readonly bounds: AABB;
    readonly minEntities: number;
    readonly maxEntities: number;
    readonly maxDepth: number;
    readonly depth?: number;
    readonly parent?: Quadrant<TEntity> | undefined;
};

export class Quadrant<TEntity> {
    private readonly _map: QuadtreeMap<TEntity>;
    private readonly _bounds: AABB;
    private readonly _minEntities: number;
    private readonly _maxEntities: number;
    private readonly _maxDepth: number;
    private readonly _depth: number;
    private readonly _parent: Quadrant<TEntity> | undefined;

    private _entries: QuadrantEntry<TEntity>[] = [];
    private _children: Quadrant<TEntity>[] = [];
    private _hasChildren: boolean = false;

    constructor(properties: QuadrantProperties<TEntity>) {
        this._map = properties.map;
        this._bounds = properties.bounds;
        this._minEntities = properties.minEntities;
        this._maxEntities = properties.maxEntities;
        this._maxDepth = properties.maxDepth;
        this._depth = properties.depth || 0;
        this._parent = properties.parent;
    }

    public insert(entity: TEntity, bounds: AABB): void {
        if (!bounds.intersects(this._bounds))
            return;

        if (this._hasChildren) {
            for (const child of this._children)                
                child.insert(entity, bounds);

            return;
        }

        const existing = this._entries.find(e => e.entity === entity);
        if (existing)
            return;

        const entry: QuadrantEntry<TEntity> = { entity, bounds };

        if (this._depth < this._maxDepth && this._entries.length + 1 > this._maxEntities) {
            const entries = [...this._entries, entry];

            this.clear();
            this.subdivide();

            for (const entry of entries)
                this.insert(entry.entity, entry.bounds);

            return;
        }

        this._map.insert(entity, this);
        this._entries.push(entry);
    }

    public remove(entity: TEntity): void {
        const bubbleCollapse = (quadrant: Quadrant<TEntity> = this): void => {
            if (quadrant._entries.length >= quadrant._minEntities)
                return;

            const entries = quadrant.accumulateEntries();

            quadrant.clear();

            for (const entry of entries)
                quadrant.insert(entry.entity, entry.bounds);

            if (quadrant._parent)
                bubbleCollapse(quadrant._parent);
        };

        if (this._hasChildren) {
            for (const child of this._children)
                child.remove(entity);

            return;
        }

        const index = this._entries.findIndex(e => e.entity === entity);
        if (!~index)
            return;

        this._map.remove(entity, this);
        this._entries.splice(index, 1);

        if (this._parent)
            bubbleCollapse(this._parent);
    }

    public update(entity: TEntity, newBounds?: AABB): void {
        const bubbleInsert = (quadrant: Quadrant<TEntity>, entry: QuadrantEntry<TEntity>): void => {
            if (quadrant._bounds.contains(entry.bounds)) {
                quadrant.insert(entry.entity, entry.bounds);
                return;
            }

            if (quadrant._parent)
                bubbleInsert(quadrant._parent, entry);
        };

        const entry = this._entries.find(e => e.entity === entity);
        if (!entry)
            return;

        entry.bounds = newBounds || entry.bounds;

        if (this._bounds.contains(entry.bounds))
            return;

        if (!this._bounds.intersects(entry.bounds))
            this.remove(entity);

        if (this._parent)
            bubbleInsert(this._parent, entry);
    }

    public clear(): void {
        if (this._hasChildren) {
            for (const child of this._children)
                child.clear();

            this._children = [];
            this._hasChildren = false;
        }

        for (const entry of this._entries)
            this._map.remove(entry.entity, this);

        this._entries = [];
    }

    public intersections(entity: TEntity): TEntity[] {
        const entities: TEntity[] = [];

        const entry = this._entries.find(e => e.entity === entity);
        if (entry) {
            for (const other of this._entries) {
                if (other === entry)
                    continue;

                if (entry.bounds.intersects(other.bounds))
                    entities.push(other.entity);
            }
        }

        return entities;
    }

    private subdivide(): void {
        for (let x = 0; x < 2; x++) {
            const minX = x === 0 ? this._bounds.x : this._bounds.centerX;

            for (let y = 0; y < 2; y++) {
                const minY = y === 0 ? this._bounds.y : this._bounds.centerY;
                const bounds = new AABB(minX, minY, this._bounds.width / 2, this._bounds.height / 2);

                const properties: QuadrantProperties<TEntity> = {
                    map: this._map,
                    bounds: bounds,
                    minEntities: this._minEntities,
                    maxEntities: this._maxEntities,
                    maxDepth: this._maxDepth,
                    depth: this._depth + 1,
                    parent: this
                };

                this._children[x + y * 2] = new Quadrant<TEntity>(properties);
            }
        }

        this._hasChildren = true;
    }

    private accumulateEntries(accumulator: QuadrantEntry<TEntity>[] = []): ReadonlyArray<QuadrantEntry<TEntity>> {
        if (this._hasChildren) {
            for (const child of this._children)
                child.accumulateEntries(accumulator);
        }
        else {
            for (const entry of this._entries) {
                const index = accumulator.findIndex(e => e.entity === entry.entity);
                if (~index)
                    continue;

                accumulator.push(entry);
            }
        }

        return accumulator;
    }

    public get bounds(): AABB {
        return this._bounds;
    }

    public get minEntities(): number {
        return this._minEntities;
    }

    public get maxEntities(): number {
        return this._maxEntities;
    }

    public get parent(): Quadrant<TEntity> | undefined {
        return this._parent;
    }

    // TODO: This is VERY unperformant
    public get entryCount(): number {
        return this.accumulateEntries().length;
    }

    public get entries(): ReadonlyArray<QuadrantEntry<TEntity>> {
        return this._entries;
    }

    public get children(): ReadonlyArray<Quadrant<TEntity>> {
        return this._children;
    }

    public get hasChildren(): boolean {
        return this._hasChildren;
    }
}