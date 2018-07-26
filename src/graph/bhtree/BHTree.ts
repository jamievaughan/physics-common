import { Quadtree } from '../quadtree';
import { AABB, /*Vector2*/ } from '../../math';

//const THETA = 0.8;
//const G = 6.67e-11;

export class BHTree<TEntity> extends Quadtree<TEntity> {
    //private readonly _theta: number;
    //private readonly _g: number;

    constructor(aabb: AABB) {//, theta?: number, g?: number) {
        super({ bounds: aabb, minEntities: 1, maxEntities: 1 });

    //    this._g = g || G;
    //    this._theta = theta || THETA;
    }

    //public forces(entity: TEntity): Vector2 {
    //    return new Vector2();
    //}
}