from app.utils.logger import Logger

from flask import Flask, jsonify, request
from sqlalchemy.sql import text
from sqlalchemy.orm import Session
from app.configs.extensions import db

app = Flask(__name__)

class NavigationService:
    @staticmethod
    def get_shortest_path(start_location, end_location):
        if end_location == None:
            # get the nearest market
            end_location =  NavigationService.get_nearest_market(start_location)
            market_id = end_location['id']
            end_location = f"{end_location['latitude']} {end_location['longitude']}"

        Logger.break_line()
        Logger.log("Shortest Path Flow: ", "red")

        print("Start Location: ", start_location)
        print("End Location: ", end_location)
        
        start_location = start_location.split(' ')
        end_location = end_location.split(' ')

        # Unpack start location
        start_latitude = start_location[0]
        start_longitude = start_location[1]

        # Unpack end location
        end_latitude = end_location[0]
        end_longitude = end_location[1]

        Logger.break_line()
        Logger.log("Start latitude, longitude: ", "red")
        print(start_latitude + ", " + start_longitude)

        Logger.break_line()
        Logger.log("End latitude, longitude: ", "red")
        print(end_latitude + ", " + end_longitude)

        # Define the SQL query
        query = text(f"""
            WITH market_location AS (
                SELECT geom
                FROM markets
                WHERE id = {market_id}
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
            Logger.break_line()
            Logger.log("Query: ", "red")
            print(query)

            # Execute the query and fetch all results
            result = session.execute(query).fetchall()

        nodes = [{
            "latitude": row[2],
            "longitude": row[3],
        } for row in result]

        Logger.break_line()
        Logger.log("Result: ", "red")
        print(nodes)

        return nodes


    @staticmethod
    def get_nearest_market(location):
        location = location.split(' ')

        # Unpack location
        latitude = location[0]
        longitude = location[1]

        # Define the SQL query
        query = text(f"""
            SELECT id,
                name,
                ST_X(geom) AS longitude,
                ST_Y(geom) AS latitude
            FROM markets
            ORDER BY geom <-> ST_SetSRID(ST_MakePoint({longitude}, {latitude}), 4326)
            LIMIT 1;
        """)

        result = None

        # Create a new session
        with Session(db.engine) as session:
            Logger.break_line()
            Logger.log("Query: ", "red")
            print(query)

            # Execute the query and fetch the first result
            result = session.execute(query).fetchone()

        market = {
            "id": result[0],
            "name": result[1],
            "latitude": result[3],
            "longitude": result[2],
        }

        Logger.break_line()
        Logger.log("Result: ", "red")
        print(market)

        return market