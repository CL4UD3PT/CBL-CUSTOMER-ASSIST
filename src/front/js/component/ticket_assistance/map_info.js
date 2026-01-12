
import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";


export const MapInfo = (props) => {
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCOcxTSXvSDDWIP9DyVSDLqMYEApldW_yQ",
    libraries: ["geometry", "drawing", "places"]
  });

  const origin = props.addresses.origin;
  const destination = props.addresses.destination;

  const fetchDirections = useCallback(() => {
    if (!window.google) return;
    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };
    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDirections(result);
        const route = result.routes[0];
        const legs = route.legs[0];
        setDistance(legs.distance.text);
        setDuration(legs.duration.text);
      } else {
        setDirections(null);
        setDistance(null);
        setDuration(null);
        console.error("Error fetching directions:", status);
      }
    });
  }, [origin, destination]);

  useEffect(() => {
    if (isLoaded) {
      fetchDirections();
    }
  }, [isLoaded, fetchDirections]);

  if (loadError) return <div>Erro ao carregar o mapa</div>;
  if (!isLoaded) return <div>Carregando mapa...</div>;

  return (
    <div style={{ height: "400px", marginBottom: "50px" }}>
      <GoogleMap
        mapContainerStyle={{ height: "100%", borderRadius: "0.375rem" }}
        zoom={8}
        center={{ lat: -34.397, lng: 150.644 }}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      {distance && <div><strong>Distance: </strong>{distance}</div>}
      {duration && <div><strong>Duration: </strong>{duration}</div>}
    </div>
  );
};
