import React, { useEffect, useState, useCallback } from "react";

export const MapInfo = ({ addresses }) => {
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const origin = addresses.origin;
  const destination = addresses.destination;

  const fetchDirections = useCallback(
    async (mapInstance) => {
      if (!origin || !destination) return;

      const { DirectionsService, DirectionsRenderer } =
        await google.maps.importLibrary("routes");

      const service = new DirectionsService();

      service.route(
        {
          origin,
          destination,
          travelMode: "DRIVING"
        },
        (result, status) => {
          if (status === "OK") {
            const leg = result.routes[0].legs[0];
            setDistance(leg.distance.text);
            setDuration(leg.duration.text);

            const renderer = new DirectionsRenderer();
            renderer.setMap(mapInstance);
            renderer.setDirections(result);
          }
        }
      );
    },
    [origin, destination]
  );

  useEffect(() => {
    const initMap = async () => {
      const { Map } = await google.maps.importLibrary("maps");

      const mapInstance = new Map(document.getElementById("map"), {
        center: { lat: 40.9, lng: -8.6 },
        zoom: 8
      });

      setMap(mapInstance);
      fetchDirections(mapInstance);
    };

    initMap();
  }, [fetchDirections]);

  return (
    <div className="mb-3" data-debug="map-info">
      <div style={{ marginBottom: "50px" }}>
        <div id="map" style={{ height: "400px" }} />
        {distance && <div><strong>Distance:</strong> {distance}</div>}
        {duration && <div><strong>Duration:</strong> {duration}</div>}
        <button onClick={() => {
          const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(addresses.origin)}&destination=${encodeURIComponent(addresses.destination)}`;
          window.open(url, "_blank");
        }} className="btn btn-primary">
          Abrir no Google Maps
        </button>


      </div>
    </div>
  );
};
