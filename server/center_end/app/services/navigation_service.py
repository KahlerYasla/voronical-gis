from sqlalchemy import text
from app.configs.extensions import db

class NavigationService:
    def get_shortest_path(self, start_location):
        # Unpack start location
        start_latitude, start_longitude = start_location

        # Define the SQL query
        query = text("""
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
    ORDER BY ml.geom <-> the_geom
    LIMIT 1
),
user_location AS (
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
    ORDER BY ul.geom <-> the_geom
    LIMIT 1
),
path_edges AS (
    SELECT e.id,
        e.source,
        e.target,
        d.seq,
        d.node,
        d.edge,
        d.cost,
        ST_StartPoint(e.the_geom) AS start_geom,
        ST_EndPoint(e.the_geom) AS end_geom
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
),
points AS (
    SELECT seq, 
           ST_X(start_geom) AS longitude, 
           ST_Y(start_geom) AS latitude
    FROM path_edges
    UNION
    SELECT seq + 0.5 AS seq,
           ST_X(end_geom) AS longitude,
           ST_Y(end_geom) AS latitude
    FROM path_edges
)
SELECT row_number() OVER () AS uid,
    points.seq,
    points.latitude,
    points.longitude
FROM points
ORDER BY points.seq;
        """)

        # Execute the query
        result = db.session.execute(query, {'start_latitude': start_latitude, 'start_longitude': start_longitude})

        # Fetch all results
        path = result.fetchall()

        print(path)

        return path


    def find_nearest_node(self, location):
        latitude, longitude = location

        query = text("""
            WITH given_location AS (
                SELECT ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326) AS geom
            )
            SELECT m.id
            FROM markets m,
                given_location
            ORDER BY m.geom <-> given_location.geom
            LIMIT 1;
        """)

        result = db.session.execute(query, {'latitude': latitude, 'longitude': longitude})
        closest_market_id = result.fetchone()[0]

        print(closest_market_id)
        
        return closest_market_id
    

    def get_voronoi_diagram(self):
        query = text("""
            SELECT ST_AsGeoJSON(ST_VoronoiPolygons(ST_Collect(geom))) AS voronoi
            FROM markets
        """)

        result = db.session.execute(query)
        voronoi = result.fetchone()[0]

        print(voronoi)

        return voronoi
