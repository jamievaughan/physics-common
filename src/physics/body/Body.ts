import { BodyType } from './BodyType';
import { BodyDefinition } from './BodyDefinition';

import { Vector2, Polygon } from '../../math';

import * as _ from 'lodash';

const INERTIA_SCALE = 0.2;

const DEFAULT_LINEAR_DAMPING = 0.1;
const DEFAULT_ANGULAR_DAMPING = 0.1;
const DEFAULT_RESTITUTION = 0.8;
const DEFAULT_MASS = 0.6;

export class Body {
    public readonly position = new Vector2();
    public readonly linearAcceleration = new Vector2();
    public readonly linearVelocity = new Vector2();

    public type: BodyType = BodyType.STATIC;
    public angle: number = 0;
    public angularAcceleration: number = 0;
    public angularVelcoity: number = 0;
    public contacts: Vector2[] = [];

    private _mass: number = 0;
    private _inverseMass: number = 0;
    private _inertia: number = 0;
    private _inverseInertia: number = 0;
    private _shape: Polygon;
    private _linearDamping: number = 0;
    private _angularDamping: number = 0;
    private _restitution: number = 0;

    constructor(def: BodyDefinition) {
        this.type = def.type;
        this.mass = def.mass || DEFAULT_MASS;
        this.angularAcceleration = def.angularAcceleration || 0;
        this.angularVelcoity = def.angularVelocity || 0;

        this._shape = def.shape.clone();

        this.linearDamping = def.linearDamping || DEFAULT_LINEAR_DAMPING;
        this.angularDamping = def.angularDamping || DEFAULT_ANGULAR_DAMPING;
        this.restitution = def.restitution || DEFAULT_RESTITUTION;

        if (def.linearAcceleration)
            this.linearAcceleration.set(def.linearAcceleration.x, def.linearAcceleration.y);

        if (def.linearVelocity)
            this.linearVelocity.set(def.linearVelocity.x, def.linearVelocity.y);
        
        this.inertia = def.inertia || INERTIA_SCALE * this.calculateInertia();

        this.translate(new Vector2(def.position.x, def.position.y));
        this.rotate(def.angle || 0);
    }

    public translate(translation: Vector2): void {
        this.position.add(translation);
        this._shape.translate(translation.x, translation.y);
    }

    public rotate(degrees: number): void {
        this.angle += degrees;
        this.angle = this.angle % 360;

        this._shape.rotate(degrees);
    }

    public impulse(impulse: Vector2, point: Vector2): void {
        const offset = point.sub(this.position, true);

        this.linearVelocity.add(impulse.scale(this._inverseMass, true));
        this.angularVelcoity += offset.cross(impulse) * this._inverseInertia;
    }

    public clearForces(): void {
        this.linearAcceleration.zero();
        this.angularAcceleration = 0;
    }

    private calculateInertia(): number {
        let numerator = 0;
        let denominator = 0;
        
        this._shape.vertices.forEach((vertex, index, array) => {
            const next = array[(index + 1) % array.length];
            const cross = Math.abs(next.cross(vertex));

            numerator += cross * (next.dot(next) + next.dot(vertex) + vertex.dot(vertex));
            denominator += cross;
        });

        return (this._mass / 6) * (numerator / denominator);
    }

    public set mass(mass: number) {
        this._mass = mass;
        this._inverseMass = 1 / mass;
    }

    public set inertia(inertia: number) {
        this._inertia = inertia;
        this._inverseInertia = 1 / inertia;
    }

    public set linearDamping(linearDamping: number) {
        this._linearDamping = _.clamp(1 - linearDamping, 0, 1);
    }

    public set angularDamping(angularDamping: number) {
        this._angularDamping = _.clamp(1 - angularDamping, 0, 1);
    }

    public set restitution(restitution: number) {
        this._restitution = _.clamp(1 - restitution, 0, 1);
    }

    public get shape(): Polygon {
        return this._shape;
    }

    public get mass(): number {
        return this._mass;
    }

    public get inverseMass(): number {
        return this._inverseMass;
    }

    public get inertia(): number {
        return this._inertia;
    }

    public get inverseInertia(): number {
        return this._inverseInertia;
    }

    public get linearDamping(): number {
        return this._linearDamping;
    }

    public get angularDamping(): number {
        return this._angularDamping;
    }

    public get restitution(): number {
        return this._restitution;
    }
}