import { BodyType } from './BodyType';
import { Polygon } from '../../math';

export type Point = { readonly x: number, readonly y: number };

export interface BodyDefinition {
    readonly type: BodyType;
    readonly shape: Polygon;
    readonly position: Point;
    readonly linearAcceleration?: Point;
    readonly linearVelocity?: Point;
    readonly angle?: number;
    readonly mass?: number;
    readonly angularAcceleration?: number;
    readonly angularVelocity?: number;
    readonly linearDamping?: number;
    readonly angularDamping?: number;
    readonly restitution?: number;
}