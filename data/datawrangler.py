import geopandas as gpd

'''
First, convert baselayer shapefile to geojson:
'''
def main():
    la_countylines = gpd.read_file('drp/DRP_COUNTY_BOUNDARY.shp')
    la_countylines = la_countylines.to_crs(epsg=5070)
    la_countylines.geometry = la_countylines.geometry.convex_hull

    df = gpd.read_file('crithabs/crithabs.shp')
    df.crs = {'init':'epsg:5070'}
    df.geometry = df.geometry.simplify(.01)

    la_habitats = gpd.overlay(la_countylines, df, how='intersection')
    la_birds = la_habitats[la_habitats.species == 'Birds']
    la_reptiles = la_habitats[la_habitats.species == 'Reptiles']
    la_insects = la_habitats[la_habitats.species == 'Insects']
    la_amphibians = la_habitats[la_habitats.species == 'Amphibians']

    la_birds.to_file('la_critters/la_birds.shp')
    la_reptiles.to_file('la_critters/la_reptiles.shp')
    la_insects.to_file('la_critters/la_insects.shp')
    la_amphibians.to_file('la_critters/la_amphibians.shp')
    
if __name__ == "__main__":
    main()
