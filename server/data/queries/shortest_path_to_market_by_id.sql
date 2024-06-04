SELECT row_number() over () AS uid,
    *
FROM (
        WITH market_location AS (
            SELECT geom
            FROM markets
            WHERE id = 20
        ),
        market_edge AS (
            SELECT id,
                source,
                target,
                the_geom,
                ST_Distance(the_geom, ml.geom) AS dist
            FROM edges,
                market_location ml
            ORDER BY ml.geom <->the_geom
            LIMIT 1
        ), user_location AS (
            SELECT ST_SetSRID(ST_MakePoint(29.007087, 41.042127), 4326) AS geom
        ),
        user_edge AS (
            SELECT id,
                source,
                target,
                the_geom,
                ST_Distance(the_geom, ul.geom) AS dist
            FROM edges,
                user_location ul
            ORDER BY ul.geom <->the_geom
            LIMIT 1
        )
        SELECT e.*,
            d.seq,
            d.node,
            d.edge,
            d.cost
        FROM pgr_dijkstra(
                'SELECT id, source, target, cost FROM edges',
                (
                    SELECT source
                    FROM market_edge
                ),
                (
                    SELECT target
                    FROM user_edge
                ),
                directed := false
            ) AS d
            JOIN edges AS e ON d.edge = e.id
        ORDER BY d.seq
    ) AS subq_1