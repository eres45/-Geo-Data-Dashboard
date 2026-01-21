import { useState, useMemo } from 'react';
import DataTable from './DataTable';
import MapComponent from './MapComponent';

export default function Dashboard({ data }) {
    const [selectedId, setSelectedId] = useState(null);
    const [highlightedId, setHighlightedId] = useState(null); // For hover effects
    const [viewState, setViewState] = useState({ lat: 12.9716, lng: 77.5946, zoom: 13 });

    // Handle interaction from Table
    const handleRowClick = (item) => {
        setSelectedId(item.id);
        setViewState({
            lat: item.latitude,
            lng: item.longitude,
            zoom: 16 // Zoom in when clicking a row
        });
    };

    // Handle interaction from Map
    const handleMarkerClick = (id) => {
        setSelectedId(id);
        // Optional: scroll table to row
    };

    return (
        <div className="flex h-full gap-4 p-4 box-border min-h-0">
            {/* Table Section - Fixed Width */}
            <div className="w-[450px] shrink-0 h-full glass-panel overflow-hidden flex flex-col">
                <DataTable
                    data={data}
                    selectedId={selectedId}
                    onRowClick={handleRowClick}
                    highlightedId={highlightedId}
                    setHighlightedId={setHighlightedId}
                />
            </div>

            {/* Map Section - Flex Grow */}
            <div className="flex-1 h-full glass-panel overflow-hidden relative min-w-0">
                <MapComponent
                    data={data}
                    selectedId={selectedId}
                    onMarkerClick={handleMarkerClick}
                    viewState={viewState}
                    highlightedId={highlightedId}
                    setHighlightedId={setHighlightedId}
                />
            </div>
        </div>
    );
}
