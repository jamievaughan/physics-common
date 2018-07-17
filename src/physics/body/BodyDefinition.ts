import { BodyType } from './BodyType';
import { Polygon } from '../../math';

export type Vector = { readonly x: number, readonly y: number };

export interface BodyDefinition {
    readonly type: BodyType;
    readonly shape: Polygon;
    readonly position: Vector;
    readonly linearAcceleration?: Vector;
    readonly linearVelocity?: Vector;
    readonly angle?: number;
    readonly mass?: number;
    readonly inertia?: number;
    readonly angularAcceleration?: number;
    readonly angularVelocity?: number;
    readonly linearDamping?: number;
    readonly angularDamping?: number;
    readonly restitution?: number;
}