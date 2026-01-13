<script lang="ts">
   import { 
    selectionStore, 
    selectionModeStore, 
    toolStore, 
    sketchEditStore 
  } from '../lib/stores';
  
  let selectionCount = $derived($selectionStore.length);
  let selectionMode = $derived($selectionModeStore);
  let currentTool = $derived($toolStore.activeTool);
  let isSketchMode = $derived($sketchEditStore.isEditing);
</script>

<footer class="h-8 bg-slate-800 border-t border-slate-700 flex items-center px-3 gap-4 text-xs text-slate-400">
  <!-- Selection Info -->
  <div class="flex items-center gap-2">
    <span class="text-slate-500">Selection:</span>
    <span class="text-slate-300">
      {#if selectionCount === 0}
        None
      {:else if selectionCount === 1}
        1 {selectionMode}
      {:else}
        {selectionCount} items
      {/if}
    </span>
  </div>

  <div class="w-px h-4 bg-slate-700"></div>

  <!-- Mode -->
  <div class="flex items-center gap-2">
    <span class="text-slate-500">Mode:</span>
    <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase"
          class:bg-blue-600={selectionMode === 'model'}
          class:bg-green-600={selectionMode === 'face'}
          class:bg-orange-600={selectionMode === 'edge'}
          class:bg-purple-600={selectionMode === 'vertex'}
          class:text-white={true}>
      {selectionMode}
    </span>
  </div>

  <div class="w-px h-4 bg-slate-700"></div>

  <!-- Tool -->
  <div class="flex items-center gap-2">
    <span class="text-slate-500">Tool:</span>
    <span class="text-slate-300 capitalize">{currentTool.replace('-', ' ')}</span>
  </div>

  {#if isSketchMode}
    <div class="w-px h-4 bg-slate-700"></div>
    <div class="flex items-center gap-2">
      <span class="px-2 py-0.5 bg-cyan-600 text-white rounded text-[10px] font-bold uppercase tracking-wide">
        ✎ Sketch Mode
      </span>
    </div>
  {/if}

  <div class="flex-1"></div>

  <!-- Version -->
  <span class="text-slate-500">N1 CAD v1.0</span>
</footer>