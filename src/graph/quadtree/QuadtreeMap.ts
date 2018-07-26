import { Quadrant } from './Quadrant';

export class QuadtreeMap<TEntity> {
    private readonly _map = new Map<TEntity, Quadrant<TEntity>[]>();

    public insert(entity: TEntity, ...quadrants: Quadrant<TEntity>[]): void {
        const existing = this._map.get(entity);
        if (existing)        
            existing.push(...quadrants);
        else
            this._map.set(entity, quadrants);
    }

    public remove(entity: TEntity, ...quadrants: Quadrant<TEntity>[]): void {
        const existing = this._map.get(entity);
        if (!existing)
            return;
        
        if (existing.length === quadrants.length) {
            this._map.delete(entity);
            return;
        }

        for (const quadrant of quadrants) {
            const index = existing.indexOf(quadrant);
            if (!~index)
                continue;

            existing.splice(index, 1);
        }
    }

    public get(entity: TEntity): ReadonlyArray<Quadrant<TEntity>> | undefined {
        return this._map.get(entity);
    }

    public clear(entity?: TEntity): void {
        if (entity)        
            this._map.delete(entity);
        else
            this._map.clear();
    }

    public exists(entity: TEntity): boolean {
        return this._map.has(entity);
    }
}