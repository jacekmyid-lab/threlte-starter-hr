<script lang="ts">
  import { selectionStore, documentStore } from '../lib/stores';

  let selection = $derived($selectionStore);
  let selectedNode = $derived(
    selection.length > 0 
      ? $documentStore.nodes.find(n => n.id === selection[0].modelId)
      : null
  );
</script>

<aside class="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
  <!-- Header -->
  <div class="h-10 bg-slate-900 border-b border-slate-700 flex items-center px-3">
    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Properties</span>
  </div>

  <!-- Content -->
  <div class="flex-1 overflow-y-auto p-4">
    {#if !selectedNode}
      <div class="text-center py-8 text-slate-500 text-sm">
        <p>No selection</p>
        <p class="text-xs mt-2 opacity-60">Select a model to view properties</p>
      </div>
    {:else}
      <!-- Node Info -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-slate-300 mb-3">Model Info</h3>
        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Name:</span>
            <span class="text-slate-200">{selectedNode.name}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Type:</span>
            <span class="text-slate-200 capitalize">{selectedNode.type}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">ID:</span>
            <span class="text-slate-200 font-mono text-[10px]">{selectedNode.id.slice(0, 12)}...</span>
          </div>
        </div>
      </div>

      <!-- Visibility & Lock -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-slate-300 mb-3">Display</h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input type="checkbox" checked={selectedNode.visible} class="rounded" />
            <span>Visible</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input type="checkbox" checked={selectedNode.locked} class="rounded" />
            <span>Locked</span>
          </label>
        </div>
      </div>

      <!-- Transform (placeholder) -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-slate-300 mb-3">Transform</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Position</label>
            <div class="grid grid-cols-3 gap-2">
              <input type="number" value="0" class="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200" placeholder="X" />
              <input type="number" value="0" class="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200" placeholder="Y" />
              <input type="number" value="0" class="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200" placeholder="Z" />
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</aside>