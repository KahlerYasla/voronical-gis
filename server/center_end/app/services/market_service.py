from app.configs.extensions import db
from app.models.market import Market

class MarketService:
    def create_market(self, name, location):
        market = Market(name=name, location=location)
        db.session.add(market)
        db.session.commit()
        return market


    def get_all_markets(self, territory_id):
        markets = Market.query.all()
    
        markets_list = [{
            'id': market.id,
            'name': market.name,
            'geom': market.format_geom(),
            'types': market.types,
            'rating': market.rating,
            'review_count': market.review_count
        } for market in markets]

        return markets_list


    def voronialize_markets(self):
        # Voronialize the markets by calling from postgresql defined functions
        pass
        