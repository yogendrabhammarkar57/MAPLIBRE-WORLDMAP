import React, { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import geojson from "./geoJson.json";
import additionalData from "./data.json";
import jsonObject1 from "./countrycode.json";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const updatedData = additionalData.map((obj2) => {
      const matchingObject1 = jsonObject1.find(
        (obj1) => obj1["Country"] === obj2["Area"]
      );
      if (matchingObject1) {
        return { ...obj2, ISO3: matchingObject1["ISO3 Code"] };
      }
      return obj2;
    });

    setData(updatedData);
  }, []);
  useEffect(() => {
    geojson.features?.forEach((feature) => {
      const countryISO3 = feature.properties.iso_a3;
      const matchingData = data.find((datas) => datas.ISO3 === countryISO3);

      if (matchingData) {
        const value = matchingData.Value;
        let fillColor = "#A2AED4";
        if (value >= 0 && value < 100000) {
          fillColor = "#A2AED4";
        } else if (value >= 100000 && value < 1000000) {
          fillColor = "#F0F9E8";
        } else if (value >= 1000000 && value < 10000000) {
          fillColor = "#CCD7C9";
        } else if (value >= 10000000 && value < 25000000) {
          fillColor = "#A8DDB5";
        } else if (value >= 25000000 && value < 50000000) {
          fillColor = "#7BCCC4";
        } else if (value >= 50000000 && value < 100000000) {
          fillColor = "#43A2CA";
        } else if (value >= 100000000) {
          fillColor = "#0868AC";
        }
        feature.properties["fill-color"] = fillColor;
      } else {
        feature.properties["fill-color"] = "white";
      }
    });
  }, [data]);

  useEffect(() => {
    
    const map = new maplibregl.Map({
      container: "map",
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
      center: [0, 22],
      minZoom: 1,
    });

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    const zoomInButton = document.createElement("button");
    zoomInButton.textContent = "+";
    zoomInButton.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-in";
    zoomInButton.addEventListener("click", () => {
      map.zoomIn();
    });

    const zoomOutButton = document.createElement("button");
    zoomOutButton.textContent = "-";
    zoomOutButton.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-zoom-out";
    zoomOutButton.addEventListener("click", () => {
      map.zoomOut();
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.getContainer().appendChild(zoomInButton);
    map.getContainer().appendChild(zoomOutButton);

    map.on("load", () => {
      map.addSource("states", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "states-layer",
        type: "fill",
        source: "states",
        paint: {
          "fill-color": ["get", "fill-color"],
          "fill-opacity": 0.7,
          "fill-outline-color": "rgba(200, 100, 240, 1)",
        },
      });

      map.on("mousemove", "states-layer", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["states-layer"],
        });
        if (features.length > 0) {
          const feature = features[0];
          const countryName = feature.properties.name;
          const countryISO3 = feature.properties.iso_a3;
          const matchingData = data.find((data) => data.ISO3 === countryISO3);
          console.log(matchingData);
          if (matchingData) {
            const value = matchingData.Value;
            const unit = matchingData.Unit;
            popup
              .setLngLat(e.lngLat)
              .setHTML(
                `<strong>${countryName}</strong><br>Value: ${value} ${unit}`
              )
              .addTo(map);
          }
        } else {
          popup.remove();
        }
      });

      map.on("mouseenter", "states-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "states-layer", () => {
        popup.remove();
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.remove();
    };
  }, [data]);
;

  return (
    <div>
      <div id="map" style={{ height: "95vh" }} className="fixed-map"></div>
    </div>
  );
};

export default App;
