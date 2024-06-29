import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import pinMap from "../../assets/map-pin.svg";

export default function index() {
  return (
    <div className="flex flex-col gap-[20px]">
      <h1>Évennennements</h1>
      <div>
        <div className="flex gap-[10px] p-[5px]">
          <input
            type="text"
            placeholder="rechercher un évennement..."
            className="input input-bordered input-primary w-full"
          />
          <button className="btn btn-square btn-outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-search"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
          </button>
        </div>
        <LeafletMap />
      </div>
    </div>
  );
}

// Define an icon (optional)
const icon = L.icon({
  iconUrl: pinMap,
  iconSize: [38, 95], // size of the icon
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor: [-3, -60], // point from which the popup should open relative to the iconAnchor
});

function LeafletMap() {
  return (
    <MapContainer
      center={[48.62383301007066, 2.2451424324259324]}
      zoom={13}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      <Marker position={[48.62383301007066, 2.2451424324259324]} icon={icon}>
        <Popup>Japan Car Festival</Popup>
      </Marker>
    </MapContainer>
  );
}
