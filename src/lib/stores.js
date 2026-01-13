import { writable, derived } from 'svelte/store';

// Viewport settings
export const viewportStore = writable({
  showGrid: true,
  showAxes: true,
  showOrigin: true
});

// Document structure (CAD nodes/features)
export const documentStore = writable({
  nodes: []
});

// Sketch editing state
export const sketchEditStore = writable({
  sketchId: null,
  activeTool: null
});

// Selection state
export const selectionStore = writable({
  type: 'model', // 'model', 'face', 'edge', 'vertex'
  selectedIds: []
});

// Derived stores
export const isSketchMode = derived(
  sketchEditStore,
  $sketchEdit => $sketchEdit.sketchId !== null
);

export const activePlane = derived(
  [documentStore, sketchEditStore],
  ([$document, $sketchEdit]) => {
    if (!$sketchEdit.sketchId) return null;
    
    const sketch = $document.nodes.find(n => n.id === $sketchEdit.sketchId);
    return sketch?.plane || {
      origin: { x: 0, y: 0, z: 0 },
      xAxis: { x: 1, y: 0, z: 0 },
      yAxis: { x: 0, y: 1, z: 0 },
      normal: { x: 0, y: 0, z: 1 }
    };
  }
);