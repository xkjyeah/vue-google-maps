/**
 * @internal
 *
 * @param { [Array<Object>, Object][] } eventListeners
 */
function clearEvents(
  eventListeners: [
    (
      | google.maps.MVCArray<google.maps.LatLng>
      | google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>
    ),
    google.maps.MapsEventListener,
  ][],
): void {
  eventListeners.forEach(([, listenerHandle]) => {
    google.maps.event.removeListener(listenerHandle);
  });
}

/**
 * @internal
 *
 * @param { 'paths_changes'|'path_change' } eventName
 * @param { Function } fn
 * @param { Function } emits
 * @returns void
 */
function updatePathOrPaths<
  T extends 'paths_changed' | 'path_changed',
  U extends
    | google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>
    | google.maps.MVCArray<google.maps.LatLng> = T extends 'paths_changed'
    ? google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>
    : google.maps.MVCArray<google.maps.LatLng>,
>(eventName: T, fn: () => U, emits: (eventName: T, cb: U) => void): () => void {
  /**
   * An event to detect when a paths change
   * @property {array} paths `this.$polygonObject.getPaths()` |
   */
  return () => {
    emits(eventName, fn());
  };
}

/**
 * @internal
 *
 * @typedef ShapeHelpers
 * @property {Function} clearEvents
 * @property {Function} updatePathOrPaths
 *
 * @returns {ShapeHelpers}
 */
export function useShapesHelpers() {
  return { clearEvents, updatePathOrPaths };
}
