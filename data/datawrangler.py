import pandas as pd
import geopandas as gpd
from shapely.geometry import Polygon, mapping

'''
First, convert baselayer shapefile to geojson:
'''
def map_countynames(df):
    geocodes = pd.read_csv('drp/all-geocodes-v2018.csv')
    geocodes = geocodes[geocodes['Summary Level'] == 50]
    geocodes = geocodes[geocodes['State Code (FIPS)'] == 6]
    
    themap = {}
    for i, r in geocodes.iterrows():
        themap[r['County Code (FIPS)']] = r['Area Name (including legal/' + 
                                            'statistical area description)']
    df['COUNTY'] = df.COUNTY.map(themap)

def main():
    socal = gpd.read_file('https://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/' +
                          '1.0/boundary-set/county-subdivisions-2012.geojson')
    socal['COUNTY'] = [x['COUNTYFP'] for x in socal.metadata]
    socal = socal.dissolve(by="COUNTY")
    socal['COUNTY'] = socal.index
    socal['COUNTY'] = socal.COUNTY.astype(int)
    
    map_countynames(socal)
    
    df = gpd.read_file('crithabs/crithabs.shp')
    df.crs = {'init':'epsg:5070'}
    df = df.to_crs(epsg=4326)
    df.geometry = df.geometry.simplify(.1)

    socal_habitats = gpd.overlay(socal, df, how='intersection')
    socal.to_file('drp/socal.geojson', driver='GeoJSON')

    socal_birds = socal_habitats[socal_habitats.species == 'Birds']
    socal_fplants = socal_habitats[socal_habitats.species == 'Flowering Plants']
    socal_fishes = socal_habitats[socal_habitats.species == 'Fishes']
    socal_crust = socal_habitats[socal_habitats.species == 'Crustaceans']
    socal_amphibians = socal_habitats[socal_habitats.species == 'Amphibians']
    
    for x in [socal_birds, socal_fplants, socal_fishes, socal_crust, socal_amphibians]:
        x = x.dissolve(by="sciname")

    socal_birds.to_file('la_critters/socal_birds.geojson', driver='GeoJSON')
    socal_fplants.to_file('la_critters/socal_fplants.geojson', driver='GeoJSON')
    socal_fishes.to_file('la_critters/socal_fishes.geojson', driver='GeoJSON')
    socal_crust.to_file('la_critters/socal_crust.geojson', driver='GeoJSON')
    socal_amphibians.to_file('la_critters/socal_amphibians.geojson', driver='GeoJSON')

if __name__ == "__main__":
    main()
