import React, { useEffect, useState } from "react";

export const useGoogleMapsScript = (apiKey) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Já existe? Não carregar outra vez
    if (window.google) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,routes`;
    script.async = true;

    script.onload = () => setLoaded(true);

    document.body.appendChild(script);
  }, [apiKey]);

  return loaded;
};
