import { Vector2 } from './Vector2';
import { Polygon } from './Polygon';

export class SAT {
    public static mtv(a: Polygon, b: Polygon): Vector2 | undefined {
        if (!a.valid || !b.valid)
            return;

        // Merge both polygons normals together
        const normals = [...a.normals, ...b.normals];
        if (!normals)
            return;

        let depth = Number.MAX_VALUE;
        let normal = new Vector2();

        for (const axis of normals) {
            const p1 = a.project(axis);
            const p2 = b.project(axis);

            const m1 = p1.x - p2.y;
            const m2 = p2.x - p1.y;

            // If at least one axis doesn't overlap then we can guarantee
            // that these shapes are not colliding
            if (m1 > 0 || m2 > 0)
                return;

            // Calculate the overlap between projections
            const overlap = Math.abs(p1.x < p2.x ? m2 : m1);

            // Check if this overlap is the smallest factor
            if (depth < overlap)
                continue;

            depth = overlap;
            normal.set(axis.x, axis.y);
        }

        const direction = a.center
            .sub(b.center, true)
            .dot(normal);

        if (direction < 0)
            normal.invert();

        return normal.normalize().scale(depth);
    }
}