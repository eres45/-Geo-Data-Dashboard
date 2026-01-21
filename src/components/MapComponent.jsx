import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not working in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Custom Icon for Highlighted/Selected State
// Ideally this would be an SVG or different colored asset
const PulseIcon = L.divIcon({
    className: 'marker-pulse',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});
// Need to add global CSS for this class if not using Tailwind's hue-rotate utility or if it doesn't propagate to leaflet pane
// Actually, let's just make a small custom DivIcon for better performance with 5k markers?
// 5k markers might lag with standard Markers. Let's see. If it lags, we switch to CircleMarker.

L.Marker.prototype.options.icon = DefaultIcon;

// Child component to handle map movement
function MapController({ viewState }) {
    const map = useMap();

    useEffect(() => {
        if (viewState) {
            map.flyTo([viewState.lat, viewState.lng], viewState.zoom, {
                duration: 1.5
            });
        }
    }, [viewState, map]);

    return null;
}

export default function MapComponent({ data, selectedId, onMarkerClick, viewState, highlightedId, setHighlightedId }) {

    // Optimization: For 5000 points, simple Markers might be heavy. 
    // We'll use CircleMarkers for cleaner look and performance, and standard Marker for selected.
    // Or just limit rendering to visible bounds if needed, but requirements imply standard plotting.
    // Let's stick to CircleMarkers for the "data points" feel.

    return (
        <MapContainer
            center={[12.9716, 77.5946]}
            zoom={13}
            className="h-full w-full bg-slate-900"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <MapController viewState={viewState} />

            {/* Render Markers */}
            {/* Performance Note: Creating 5000 React components is heavy. Ideally we use a clustered layer or canvas layer.
          For this assignment, let's optimize by using CircleMarkers which are lighter.*/}
            {data.map(item => {
                const isSelected = selectedId === item.id;
                const isHighlighted = highlightedId === item.id;

                // Show standard Marker if selected/highlighted, otherwise small dot
                if (isSelected || isHighlighted) {
                    return (
                        <Marker
                            key={item.id}
                            position={[item.latitude, item.longitude]}
                            icon={PulseIcon}
                            eventHandlers={{
                                click: () => onMarkerClick(item.id),
                            }}
                            zIndexOffset={1000} // Bring to front
                        >
                            <Popup className="glass-popup" minWidth={200}>
                                <div className="p-1">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Project</div>
                                    <div className="text-lg font-bold text-white mb-2">{item.projectName}</div>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' :
                                                item.status === 'Pending' ? 'bg-amber-400' : 'bg-slate-500'
                                            }`}></span>
                                        <span className="text-sm text-gray-300 font-medium">{item.status}</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                }

                return (
                    <CircleMarkerWithEvents
                        key={item.id}
                        center={[item.latitude, item.longitude]}
                        pathOptions={{
                            color: 'transparent', // No border for cleaner look
                            fillColor: item.status === 'Active' ? '#4ade80' : item.status === 'Pending' ? '#fbbf24' : '#64748b',
                            fillOpacity: 0.8,
                            radius: 3
                        }}
                        item={item}
                        onClick={() => onMarkerClick(item.id)}
                        onHover={(hovering) => setHighlightedId(hovering ? item.id : null)}
                    />
                )
            })}

        </MapContainer>
    );
}

// Wrapper for CircleMarker to handle events nicely
import { CircleMarker } from 'react-leaflet';

function CircleMarkerWithEvents({ center, pathOptions, onClick, onHover, item }) {
    const eventHandlers = useMemo(() => ({
        click: onClick,
        mouseover: () => onHover(true),
        mouseout: () => onHover(false)
    }), [onClick, onHover]);

    return (
        <CircleMarker
            center={center}
            pathOptions={pathOptions}
            eventHandlers={eventHandlers}
        >
            <Popup>
                <strong>{item.projectName}</strong><br />
                Status: {item.status}
            </Popup>
        </CircleMarker>
    )
}
