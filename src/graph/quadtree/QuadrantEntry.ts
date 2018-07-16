import { AABB } from '../../math';

export interface QuadrantEntry<TEntity> {
    entity: TEntity;
    bounds: AABB;
}