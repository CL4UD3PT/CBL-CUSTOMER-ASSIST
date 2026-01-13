import React, { useEffect, useState, useCallback, useMemo } from "react";
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export const MapInfo = () => {

  return (
<Map
      initialViewState={{
        longitude: -8.6,
        latitude: 40.9,
        zoom: 12
      }}
      style={{ width: "100%", height: "400px" }}
      mapStyle="https://demotiles.maplibre.org/style.json"
    />
  );
};