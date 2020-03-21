import geopandas as gpd
from shapely.geometry import Polygon, mapping

'''
First, convert baselayer shapefile to geojson:
'''
def main():
    socal = gpd.read_file('https://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/' +
                          '1.0/boundary-set/county-subdivisions-2012.geojson')
    socal['COUNTY'] = [x['COUNTYFP'] for x in socal.metadata]
    socal = socal.dissolve(by="COUNTY")
    df = gpd.read_file('crithabs/crithabs.shp')
    df.crs = {'init':'epsg:5070'}
    df = df.to_crs(epsg=4326)
    df.geometry = df.geometry.simplify(.1)

    socal_habitats = gpd.overlay(socal, df, how='intersection')
    socal.to_file('drp/socal.geojson', driver='GeoJSON')

    la_birds = socal_habitats[la_habitats.species == 'Birds']
    la_fplants = socal_habitats[la_habitats.species == 'Flowering Plants']
    la_fishes = socal_habitats[la_habitats.species == 'Fishes']
    la_crust = socal_habitats[la_habitats.species == 'Crustaceans']
    la_amphibians = socal_habitats[la_habitats.species == 'Amphibians']
    
    for x in [la_birds, la_fplants, la_fishes, la_crust, la_amphibians]:
        x = x.dissolve(by="sciname")

    la_birds.to_file('la_critters/la_birds.geojson', driver='GeoJSON')
    la_fplants.to_file('la_critters/la_fplants.geojson', driver='GeoJSON')
    la_fishes.to_file('la_critters/la_fishes.geojson', driver='GeoJSON')
    la_crust.to_file('la_critters/la_crust.geojson', driver='GeoJSON')
    la_amphibians.to_file('la_critters/la_amphibians.geojson', driver='GeoJSON')

if __name__ == "__main__":
    main()
