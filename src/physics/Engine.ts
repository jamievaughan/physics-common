import { Body, BodyType } from './body';
import { World } from './World';

import { SAT, CMC, Vector2 } from '../math';

const DEFAULT_DELTA =  1000 / 60;

export class Engine {
    public step(world: World, delta: number = DEFAULT_DELTA): void {
        this.updatePositions(world, delta);
        this.resolveCollisions(world);
    }

    private updatePositions(world: World, delta: number): void {
        for (const body of world.bodies) {
            if (body.type !== BodyType.STATIC) {
                // Only dynamic bodies accelerate
                if (body.type === BodyType.DYNAMIC) {
                    body.linearVelocity.add(body.linearAcceleration);
                    body.angularVelcoity += body.angularAcceleration;
                }

                // Apply both linear and angular velocities
                body.translate(body.linearVelocity.scale(delta, true));
                body.rotate(body.angularVelcoity * delta);

                body.clearForces();

                // Apply velocity damping to dynamic bodies
                if (body.type === BodyType.DYNAMIC) {
                    body.linearVelocity.scale(body.linearDamping ** delta);
                    body.angularVelcoity *= body.angularDamping ** delta;
                }
            }

            if (!world.tree.update(body))
                world.tree.insert(body, body.shape.aabb);
        }
    }

    private resolveCollisions(world: World): void {
        for (const body of world.bodies) {
            // Clear any existing contact points
            body.contacts = [];

            if (body.type !== BodyType.DYNAMIC)
                continue;

            // Get all potential collisions with this body
            const broadphase = world.tree.intersections(body);
            if (!broadphase)
                continue;

            // Calculate narrowphase collision detection
            for (const other of broadphase) {
                const mtv = SAT.mtv(body.shape, other.shape);
                if (!mtv)
                    continue;

                this.collisionImpulse(body, other, mtv);
                this.collisionCorrection(world, body, other, mtv);
            }
        }
    }

    // TODO: Move
    private collisionImpulse(body: Body, other: Body, mtv: Vector2): void {
        const velocity = body.linearVelocity.sub(other.linearVelocity, true);

        const normal = mtv.normalize(true);
        const velocityNormal = velocity.dot(normal);
        if (velocityNormal > 0)
            return;

        const totalInverseMass = body.inverseMass + other.inverseMass;

        const e = Math.min(body.restitution, other.restitution);
        const i = (-(1 + e) * velocityNormal) / totalInverseMass;

        const impulse = normal.scale(i, true);

        if (body.type === BodyType.STATIC || other.type === BodyType.STATIC)
            impulse.scale(2);

        const contacts = CMC.points(body.shape, other.shape, normal);
        if (!contacts)
            return;

        body.contacts = [...contacts, ...body.contacts];

        const contactImpulse = impulse.scale(1 / contacts.length, true);

        // Apply the impulse for all contact points
        for (const contact of contacts) {
            // TODO: Apply contact friction
            body.impulse(contactImpulse, contact);

            if (other.type !== BodyType.DYNAMIC)
                continue;

            other.impulse(contactImpulse.invert(true), contact);            
        }
    }
    
    // TODO: Move
    private collisionCorrection(world: World, body: Body, other: Body, mtv: Vector2): void {
        // Correction is proportional to the body's mass
        const totalInverseMass = body.inverseMass + other.inverseMass;

        // TODO: Apply correction slop

        body.translate(other.type !== BodyType.STATIC
            ? mtv.scale(body.inverseMass / totalInverseMass, true)
            : mtv);

        world.tree.update(body);

        if (other.type !== BodyType.DYNAMIC)
            return;

        other.translate(mtv.scale(other.inverseMass / totalInverseMass, true).invert());
        world.tree.update(other);
    }
}