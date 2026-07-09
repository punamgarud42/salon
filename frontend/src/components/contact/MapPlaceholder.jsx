import './MapPlaceholder.css';

/**
 * MapPlaceholder — a styled stand-in for an embedded map.
 *
 * This is intentionally NOT a real Google Maps / OpenStreetMap iframe: the
 * address used elsewhere in this project ("Shop 12, MG Road, Nagpur...") is
 * placeholder content, not a real verified location. Embedding a real map
 * pointed at that address would show a real place on a map that isn't
 * actually this business — more misleading than an honest placeholder.
 *
 * To go live: open Google Maps, find your real business listing, use
 * Share → Embed a map, and paste the resulting <iframe> here in place of
 * this component's contents. Nothing else needs to change.
 */
export default function MapPlaceholder({ address }) {
  return (
    <div className="map-placeholder">
      <div className="map-placeholder__grid" aria-hidden="true" />
      <div className="map-placeholder__pin" aria-hidden="true">📍</div>
      <p className="map-placeholder__address">{address}</p>
      <p className="map-placeholder__note">
        Map embed placeholder — replace with a real Google Maps embed once you have your
        verified business listing.
      </p>
    </div>
  );
}
