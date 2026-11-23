# 31 · The water cycle

Author: Daniella · Started: 2026-11-02 · Status: v0.2 · Stack: static HTML + JS, MapLibre GL, NASA GIBS imagery

Two ways people in Puebla, Mexico, have tried to change the weather, set against Robert E. Horton’s water cycle: a hail cannon fired by a car plant in 2018, and the tiemperos who call the rain at the volcanoes. It asks who gets to move a cloud, who benefits, and who bears the cost.

## Run

Online, once published: `https://daniellacamarena.github.io/weather-commons/31-hail-daniella-camarena/`

On your computer:

```bash
cd sketches/31-hail-daniella-camarena
python -m http.server 8000
```

Then open http://localhost:8000. The globe needs an internet connection for its satellite imagery.

To rebuild the drawings and pages after editing anything in `tools/`:

```bash
cd sketches/31-hail-daniella-camarena
node tools/build-pages.mjs
```

### Pages

- `index.html`: globe with live clouds, and layers for each event.
- `comparison.html`: Horton’s cycle beside each case, with 13 numbered steps and a step-through.
- `hail-cannon-2018.html`, `tiemperos-2025.html`: one line drawing each, with notes and sources.
- `archive.html`: carousel of ways of watching the sky, the myth of Tlaloc, Chalchiuhtlicue and Tlalocan, a timeline and a gallery.
- `nubes-almecatla-2018.html`: rainfall and cloud data around the plant in 2018 (in Spanish).

## 1. Event

Two weather modification practices on the same storms in Puebla.

- **Hail cannon, 2018.** The Volkswagen plant at San Lorenzo Almecatla, Cuautlancingo, ran three acetylene hail cannons in automatic mode from May to 20 August 2018, triggered by weather radar, to protect new cars parked in the open. Farmers nearby said the rain stopped and about 2,000 ha of rain-fed maize were lost.
- **Tiemperos, every year.** In villages on Popocatépetl and Iztaccíhuatl, such as San Mateo Ozolco, tiemperos (graniceros, aureros) climb to caves and crosses to feed the volcanoes, call the rain and turn the hail aside, on a ritual calendar that follows the rainy season (12 March, 3 May, 30 August, early November).

## 2. Simulate

- **Baseline.** Horton’s hydrologic cycle (1931), redrawn as 13 numbered steps from evaporation to stream flow.
- **Affected cycles.** Each case is drawn as a line drawing with the same step numbers. Solid circles mark what happens to the water; dashed circles mark what each side says it changes.
- **Step-through.** `comparison.html` walks the 13 steps and says, for each case, whether it acts there, what it claims and what the record shows.
- **Season playback.** The globe steps day by day through May–October 2018, showing that afternoon’s MODIS Aqua image with ERA5 rain and cloud cover at the plant.

Nothing here is a physical model of a cloud. The cannon’s effect is not modelled because studies have found no measurable effect of hail cannons on hail or rain.

## 3. Situate

The plant sits in the Puebla–Tlaxcala valley, between the volcanoes and the city, among rain-fed maize fields. The tiemperos work on the volcanoes that make the valley’s afternoon storms. The archive places both in a longer history: Tlaloc and the rain ceremonies, colonial and 19th-century observation (Sahagún, Alzate, the 1877 Observatorio Meteorológico Central), and machines sold to command the weather (Stiger vortex guns, 1896–1902; cloud seeding, 1946).

## 4. Narrate

One practice is a product: a company buys a machine to push storms away from its property, and the cost, real or feared, falls on the farmers around it. The other is a relationship: a community invites the clouds in for everyone’s fields. Neither has been shown to change a cloud. The difference lies in who decides, who benefits and who pays. Viewers should not conclude that the cannon caused the 2018 drought: the rain near the plant was below normal, but the data cannot show cause.

## Sources and limits

**Imagery** (observed; NASA GIBS / Worldview, open use, loaded live, not stored)
- GOES-East ABI GeoColor, latest 10-minute frame. Observed.
- VIIRS NOAA-20 Corrected Reflectance, latest complete day, and 12 Mar, 3 May, 30 Aug 2025. Observed.
- MODIS Aqua Corrected Reflectance, daily, May–Oct 2018. Observed.
- Blue Marble Shaded Relief and Bathymetry. Observed composite.

**Data** (`tools/nubes-data.json`, made earlier with `tools/analyze.mjs`, `tools/chirps.mjs`, `tools/chirps_cog.mjs`)
- CHIRPS v2.0 monthly rainfall, 0.05°, Climate Hazards Center, UC Santa Barbara. Season May–Oct 2018 against a 2010–2017 and 2019–2020 mean. Observed (satellite and gauge estimate). Public domain.
- ERA5 and ERA5-Land, Copernicus/ECMWF, via Open-Meteo: daily rain, cloud cover, soil moisture for the plant’s grid cell. Reanalysed. CC BY 4.0.

**Reported** (press and ethnography)
- Expansión, 15 and 20 Aug 2018: three devices, acetylene, a blast about every 7 s, 500 m claimed radius, 2 h/yr permit, running since May. Xataka México: about 120 dB.
- Julio Glockner Rossainz, “La nube y el sueño”, *Ciencias* 90, UNAM, April–June 2008, pp. 68–76. Quote on p. 75.
- Mario Galeana, “Plegarias para un cráter: rituales de lluvia a la sombra de los volcanes”, *Revista de la Universidad de México*, 2025: Cenobio Jiménez, El Ombligo, ritual dates.
- “Los graniceros”, *Por los caminos de la región de los Volcanes* (blog), 2011: Alcalican cave, November thanksgiving. No sources cited, so unverified.
- San Mateo Ozolco and VW plant positions: OpenStreetMap (ODbL).

**Drawings** (interpretive; made for this sketch, CC BY 4.0)
- Hydrologic cycle, a new drawing after Horton, R. E. (1931), “The field, scope, and status of the science of hydrology”, *Transactions, American Geophysical Union* 12, p. 193. Not a reproduction; check the step names against his figure.
- Hail cannon and tiemperos plates. People, shrines and the cannon are enlarged. Altitudes and temperatures are typical rainy-season values, not one storm.
- Step 9 (runoff from the paved car lot) is a general effect of paving, not a measurement there.

**Interpretive layers on the globe**
- Arrows for the farmers’ account (clouds splitting before the fields) and for moist air rising up the volcano slopes. Schematic, not observed tracks or winds.

**Archive images** (loaded from Wikimedia Commons and the Internet Archive)
- Codex Borgia (Tlaloc), Codex Borbonicus p. 5 (Chalchiuhtlicue), Codex Magliabechiano f. 11r, *Gazeta de Literatura de México* vol. 1 (1790), Stiger vortex gun photographs (State Library of Queensland, 1901–1902): public domain.
- Tlalocan mural detail, Tepantitla: photo by Juan Carlos Fonseca Mata, CC BY-SA 4.0.
- Timeline facts are general history and still need checking against cited sources.

**What this sketch cannot show**
- Whether the hail cannon changed any cloud or caused the 2018 drought.
- The real path of any 2018 storm. The globe shows one satellite pass a day.
- Exact positions of El Ombligo and the Alcalican cave.
- The tiemperos’ own account in their words, beyond the published quotes. Any further use needs their consent.
