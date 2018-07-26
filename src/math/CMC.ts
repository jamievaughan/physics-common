import { Polygon } from './Polygon';
import { Vector2 } from './Vector2';

interface Edge {
    readonly max: Vector2;
    readonly v1: Vector2;
    readonly v2: Vector2;
    readonly edge: Vector2;
}

export class CMC {
    public static points(a: Polygon, b: Polygon, normal: Vector2): Vector2[] | undefined {
        const intersectingEdge = (shape: Polygon, normal: Vector2): Edge => {
            let max = Number.MIN_VALUE;
            let index = 0;

            // Find the closest vertex in the polygon from the normal
            shape.vertices.forEach((vertex, i) => {
                const projection = normal.dot(vertex);
                if (projection > max) {
                    max = projection;
                    index = i;
                }
            });

            const first = shape.vertices[0];        
            const last = shape.vertices[shape.length - 1];

            const current = shape.vertices[index];
            const next = shape.vertices[index + 1] || first;
            const prev = shape.vertices[index - 1] || last;

            const l = current.sub(next, true).normalize();
            const r = current.sub(prev, true).normalize();

            // The edge which is most perpendicular to the normal
            // will have a dot product closer to zero
            const flipped = r.dot(normal) <= l.dot(normal);

            const v1 = flipped ? prev : current;
            const v2 = flipped ? current : next;
            const edge = v2.sub(v1, true);

            return { max: current, v1, v2, edge };
        };

        const clip = (v1: Vector2, v2: Vector2, normal: Vector2, o: number): Vector2[]  => {
            const points: Vector2[] = [];

            const d1 = normal.dot(v1) - o;
            const d2 = normal.dot(v2) - o;

            if (d1 >= 0)
                points.push(v1.clone(true));
            if (d2 >= 0)
                points.push(v2.clone(true));

            if (d1 * d2 < 0) {
                const e = v2
                    .sub(v1, true)
                    .scale(d1 / (d1 - d2))
                    .add(v1)
                    .clone(true);

                points.push(e);
            }

            return points;
        }

        // Find both edges between the shapes that were
        // involved in the intersection
        const edgeA = intersectingEdge(a, normal.invert(true));
        const edgeB = intersectingEdge(b, normal);

        const projectionA = edgeA.edge.dot(normal);
        const projectionB = edgeB.edge.dot(normal);

        // The reference and incident are flipped to ensure
        // we use the correct normal direction when clipping
        const flipped = Math.abs(projectionA) <= Math.abs(projectionB);

        const reference = flipped ? edgeB : edgeA;
        const incident = flipped ? edgeA : edgeB;

        const refv = reference.edge.normalize(true);

        const o1 = refv.dot(reference.v1);

        // Clip the incident edge by the first vertex of the reference edge
        const points = clip(incident.v1, incident.v2, refv, o1);
        if (points.length < 2)
            return;
            
        const o2 = refv.dot(reference.v2);

        // Clip in the opposite direction with the remaining of the
        // incident with the second reference vertex
        const remaining = clip(points[0], points[1], refv.invert(true), -o2);
        if (remaining.length < 2)
            return;

        const referenceNormal = new Vector2(
            reference.edge.y * -1.0,
            reference.edge.x * -(-1.0));

        if (flipped)
            referenceNormal.invert();

        const maximum = referenceNormal.dot(reference.max);

        // Make sure any final points do not exceed the edge maximum
        remaining.forEach((point, index) => {
            if (referenceNormal.dot(point) >= maximum)
                remaining.splice(index, 1);
        });

        return remaining;
    }
}