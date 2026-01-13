import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type {
  ViewportState,
  DocumentState,
  SketchEditState,
  SelectionItem,
  SelectionMode,
  ToolState,
  Plane,
  CADNode
} from './types';

// Viewport settings
export const viewportStore: Writable<ViewportState> = writable({
  showGrid: true,
  showAxes: true,
  showOrigin: true
});

// Document structure (CAD nodes/features)
const defaultPlanes: Map<string, Plane> = new Map([
  ['plane-xy', {
    id: 'plane-xy',
    name: 'XY Plane',
    origin: { x: 0, y: 0, z: 0 },
    xAxis: { x: 1, y: 0, z: 0 },
    yAxis: { x: 0, y: 1, z: 0 },
    normal: { x: 0, y: 0, z: 1 }
  }],
  ['plane-xz', {
    id: 'plane-xz',
    name: 'XZ Plane',
    origin: { x: 0, y: 0, z: 0 },
    xAxis: { x: 1, y: 0, z: 0 },
    yAxis: { x: 0, y: 0, z: 1 },
    normal: { x: 0, y: 1, z: 0 }
  }],
  ['plane-yz', {
    id: 'plane-yz',
    name: 'YZ Plane',
    origin: { x: 0, y: 0, z: 0 },
    xAxis: { x: 0, y: 1, z: 0 },
    yAxis: { x: 0, y: 0, z: 1 },
    normal: { x: 1, y: 0, z: 0 }
  }]
]);

export const documentStore: Writable<DocumentState> = writable({
  nodes: [],
  planes: defaultPlanes,
  activePlaneId: 'plane-xy'
});

// Sketch editing state
export const sketchEditStore: Writable<SketchEditState> = writable({
  isEditing: false,
  sketchId: null,
  planeId: null
});

// Tool state
export const toolStore: Writable<ToolState> = writable({
  activeTool: 'select'
});

// Selection state
export const selectionStore: Writable<SelectionItem[]> = writable([]);

// Selection mode
export const selectionModeStore: Writable<SelectionMode> = writable('model');

// Derived stores
export const isSketchMode = derived(
  sketchEditStore,
  $sketchEdit => $sketchEdit.isEditing
);

export const activePlane = derived(
  [documentStore, sketchEditStore],
  ([$document, $sketchEdit]) => {
    if (!$sketchEdit.planeId) return null;
    
    const plane = $document.planes.get($sketchEdit.planeId);
    return plane || null;
  }
);

// Helper functions
export function enterSketchMode(sketchId: string, planeId: string): void {
  const plane = defaultPlanes.get(planeId);
  if (!plane) return;

  sketchEditStore.set({
    isEditing: true,
    sketchId,
    planeId
  });

  toolStore.set({
    activeTool: 'sketch-line'
  });

  documentStore.update(doc => {
    const newNode: CADNode = {
      id: sketchId,
      name: `Sketch ${doc.nodes.length + 1}`,
      type: 'sketch',
      visible: true,
      locked: false,
      planeId,
      plane,
      entities: []
    };
    
    return {
      ...doc,
      nodes: [...doc.nodes, newNode],
      activePlaneId: planeId
    };
  });

  selectionStore.set([{ type: 'model', modelId: sketchId }]);
}

export function exitSketchMode(): void {
  sketchEditStore.set({
    isEditing: false,
    sketchId: null,
    planeId: null
  });

  toolStore.set({
    activeTool: 'select'
  });

  selectionStore.set([]);
}

export function setTool(tool: string): void {
  toolStore.update(state => ({
    ...state,
    activeTool: tool as any
  }));
}