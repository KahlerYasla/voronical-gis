from flask import Flask, jsonify, request
from sqlalchemy.sql import text
from sqlalchemy.orm import Session
from app.configs.extensions import db

app = Flask(__name__)

class NavigationService:
    @staticmethod
    def get_shortest_path(start_location, end_location):
        print(start_location)
        print(end_location)

        start_location = start_location.split(' ')
        end_location = end_location.split(' ')

        # Unpack start location
        start_latitude = start_location[0]
        start_longitude = start_location[1]

        # Unpack end location
        end_latitude = end_location[0]
        end_longitude = end_location[1]

        print(start_latitude)
        print(start_longitude)

        print(end_latitude)
        print(end_longitude)

        # Define the SQL query
        query = text(f"""
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
                SELECT ST_SetSRID(ST_MakePoint({end_longitude}, {end_latitude}), 4326) AS geom
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
                SELECT seq * 2 - 1 AS seq,
                    ST_X(start_geom) AS longitude,
                    ST_Y(start_geom) AS latitude,
                    start_geom AS geom
                FROM path_edges
            )
            SELECT row_number() OVER () AS seq,
                geom,
                latitude,
                longitude
            FROM points
            ORDER BY seq;
        """)

        result = None

        # Create a new session
        with Session(db.engine) as session:
            print(query)

            # Execute the query and fetch all results
            result = session.execute(query).fetchall()
            print(result)

        nodes = [{
            "latitude": row[2],
            "longitude": row[3],
        } for row in result]

        print(nodes)

        return nodes

