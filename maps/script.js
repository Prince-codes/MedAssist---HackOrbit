const API_KEY = "7b18e0fb384943d3b94bd58bb9f4f047";
let map, tileLayer, routeLayer = null, userLat, userLon, openMarker = null;

const lightTile = `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${API_KEY}`;
const darkTile = `https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=${API_KEY}`;

function initMap(lat, lon) {
  userLat = lat;
  userLon = lon;

  map = L.map('map', { zoomControl: true }).setView([lat, lon], 14);
  tileLayer = L.tileLayer(lightTile, {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const userIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  L.marker([lat, lon], { icon: userIcon }).addTo(map).bindPopup("You are here").openPopup();

  fetchNearbyPlaces(lat, lon);
}

function fetchNearbyPlaces(lat, lon) {
  const url = `https://api.geoapify.com/v2/places?categories=healthcare&filter=circle:${lon},${lat},3000&bias=proximity:${lon},${lat}&limit=20&apiKey=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      data.features.forEach(place => {
        const coords = place.geometry.coordinates;
        const props = place.properties;
        const name = props.name || "Unnamed Healthcare";
        const address = props.address_line1 || "No address";

        const marker = L.marker([coords[1], coords[0]]).addTo(map).bindPopup(name);

        marker.on("click", () => {
          const sidebar = document.getElementById("sidebar");

          if (openMarker === marker) {
            sidebar.classList.add("hidden");
            openMarker = null;
            if (routeLayer) {
              map.removeLayer(routeLayer);
              routeLayer = null;
            }
          } else {
            showSidebar({  name, address });
            drawRoute(userLat, userLon, coords[1], coords[0]);
            openMarker = marker;
          }
        });
      });
    });
}

function drawRoute(fromLat, fromLon, toLat, toLon) {
  const url = `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLon}|${toLat},${toLon}&mode=drive&apiKey=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (routeLayer) map.removeLayer(routeLayer);

      routeLayer = L.geoJSON(data, {
        style: { color: 'blue', weight: 5 }
      }).addTo(map);

      const props = data.features[0].properties;
      document.getElementById("place-distance").textContent = `Distance: ${(props.distance / 1000).toFixed(1)} km`;
      document.getElementById("place-eta").textContent = `ETA: ${Math.round(props.time / 60)} mins`;
    });
}

function showSidebar(info) {
  document.getElementById("place-name").textContent = info.name;
  document.getElementById("place-address").textContent = `📍 ${info.address}`;
  document.getElementById("place-distance").textContent = "";
  document.getElementById("place-eta").textContent = "";
  document.getElementById("sidebar").classList.remove("hidden");
}

document.getElementById("close-sidebar").onclick = () => {
  document.getElementById("sidebar").classList.add("hidden");
  openMarker = null;
  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }
};

document.getElementById("theme-toggle").onclick = () => {
  const body = document.body;
  body.classList.toggle("dark-theme");

  const isDark = body.classList.contains("dark-theme");
  map.removeLayer(tileLayer);
  tileLayer = L.tileLayer(isDark ? darkTile : lightTile, {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
};

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    pos => initMap(pos.coords.latitude, pos.coords.longitude),
    err => alert("Location error: " + err.message)
  );
} else {
  alert("Geolocation not supported");
}
