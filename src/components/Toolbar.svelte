<script lang="ts">
  import { toolStore, selectionModeStore, sketchEditStore, documentStore, enterSketchMode, exitSketchMode, setTool } from '../lib/stores';
  import type { SelectionMode } from '../lib/types';

  let activeTool = $state($toolStore.activeTool);
  let selectionMode = $state($selectionModeStore);
  let isSketchMode = $state($sketchEditStore.isEditing);

  $effect(() => {
    activeTool = $toolStore.activeTool;
  });

  $effect(() => {
    selectionMode = $selectionModeStore;
  });

  $effect(() => {
    isSketchMode = $sketchEditStore.isEditing;
  });

  function setSelectionMode(mode: SelectionMode) {
    selectionModeStore.set(mode);
  }

  function handleNewSketch() {
    const planeId = $documentStore.activePlaneId || 'plane-xy';
    const sketchId = `sketch_${Date.now()}`;
    enterSketchMode(sketchId, planeId);
  }
</script>

<header class="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-3 gap-2">
  <!-- Logo -->
  <div class="flex items-center gap-2 text-blue-400 font-bold mr-4">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
    </svg>
    <span>N1 CAD</span>
  </div>

  <!-- Selection Mode -->
  <div class="flex gap-1 bg-slate-900 rounded p-1">
    <button
      class="px-3 py-1 rounded text-xs font-medium transition-colors {selectionMode === 'model' ? 'bg-blue-600 text-white' : 'text-slate-400'}"
      onclick={() => setSelectionMode('model')}
      title="Model (M)"
    >
      Model
    </button>
    <button
      class="px-3 py-1 rounded text-xs font-medium transition-colors {selectionMode === 'face' ? 'bg-blue-600 text-white' : 'text-slate-400'}"
      onclick={() => setSelectionMode('face')}
      title="Face (F)"
    >
      Face
    </button>
    <button
      class="px-3 py-1 rounded text-xs font-medium transition-colors {selectionMode === 'edge' ? 'bg-blue-600 text-white' : 'text-slate-400'}"
      onclick={() => setSelectionMode('edge')}
      title="Edge (E)"
    >
      Edge
    </button>
    <button
      class="px-3 py-1 rounded text-xs font-medium transition-colors {selectionMode === 'vertex' ? 'bg-blue-600 text-white' : 'text-slate-400'}"
      onclick={() => setSelectionMode('vertex')}
      title="Vertex (V)"
    >
      Vertex
    </button>
  </div>

  <div class="w-px h-6 bg-slate-700 mx-2"></div>

  <!-- Sketch Tools (shown only in sketch mode) -->
  {#if isSketchMode}
    <div class="flex gap-1 bg-cyan-900/30 rounded p-1 border border-cyan-600">
      <button
        class="p-2 rounded hover:bg-cyan-600/30 transition-colors {activeTool === 'sketch-line' ? 'bg-cyan-600' : ''}"
        onclick={() => setTool('sketch-line')}
        title="Line (L)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
          <line x1="2" y1="14" x2="14" y2="2" stroke-width="1.5"/>
        </svg>
      </button>
      <button
        class="p-2 rounded hover:bg-cyan-600/30 transition-colors {activeTool === 'sketch-circle' ? 'bg-cyan-600' : ''}"
        onclick={() => setTool('sketch-circle')}
        title="Circle (C)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
          <circle cx="8" cy="8" r="5" stroke-width="1.5"/>
        </svg>
      </button>
      <button
        class="p-2 rounded hover:bg-cyan-600/30 transition-colors {activeTool === 'sketch-rectangle' ? 'bg-cyan-600' : ''}"
        onclick={() => setTool('sketch-rectangle')}
        title="Rectangle (R)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="10" height="8" stroke-width="1.5"/>
        </svg>
      </button>
      <button
        class="p-2 rounded hover:bg-cyan-600/30 transition-colors {activeTool === 'sketch-arc' ? 'bg-cyan-600' : ''}"
        onclick={() => setTool('sketch-arc')}
        title="Arc (A)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
          <path d="M3 13 A7 7 0 0 1 13 3" stroke-width="1.5"/>
        </svg>
      </button>
    </div>

    <button 
      class="ml-2 px-4 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm font-medium transition-colors"
      onclick={exitSketchMode}
    >
      Exit Sketch
    </button>
  {:else}
    <button 
      class="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
      onclick={handleNewSketch}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" class="inline mr-1">
        <rect x="2" y="2" width="12" height="12" stroke-width="1.5"/>
        <path d="M5 8H11M8 5V11" stroke-width="1.5"/>
      </svg>
      New Sketch
    </button>
  {/if}

  <div class="flex-1"></div>

  <!-- View Controls -->
  <div class="flex gap-1">
    <button class="p-2 rounded hover:bg-slate-700 transition-colors text-slate-300" title="Grid">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
        <path d="M2 2H14V14H2V2Z M2 6H14 M2 10H14 M6 2V14 M10 2V14" stroke-width="1"/>
      </svg>
    </button>
  </div>
</header>