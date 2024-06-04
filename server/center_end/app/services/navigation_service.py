from sqlalchemy import text
from app.configs.extensions import db

class NavigationService:
    def get_shortest_path(self, start_location):
        # Unpack start location
        start_latitude, start_longitude = start_location

        # Define the SQL query
        query = text("""
        SELECT row_number() over () AS uid, *
        FROM (
            WITH market_location AS (
                SELECT geom
                FROM markets
                WHERE id = 20
            ),
            market_edge AS (
                SELECT id, source, target, the_geom, ST_Distance(the_geom, ml.geom) AS dist
                FROM edges, market_location ml
                ORDER BY ml.geom <-> the_geom
                LIMIT 1
            ),
            user_location AS (
                SELECT ST_SetSRID(ST_MakePoint(:start_longitude, :start_latitude), 4326) AS geom
            ),
            user_edge AS (
                SELECT id, source, target, the_geom, ST_Distance(the_geom, ul.geom) AS dist
                FROM edges, user_location ul
                ORDER BY ul.geom <-> the_geom
                LIMIT 1
            )
            SELECT e.*, d.seq, d.node, d.edge, d.cost
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
