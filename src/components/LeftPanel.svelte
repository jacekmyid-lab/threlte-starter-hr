<script lang="ts">
  import { documentStore, selectionStore } from '../lib/stores';
  

  let nodes = $state($documentStore.nodes);
  let selection = $state($selectionStore);

  $effect(() => {
    nodes = $documentStore.nodes;
  });

  $effect(() => {
    selection = $selectionStore;
  });

  function isSelected(nodeId: string): boolean {
    return selection.some(s => s.modelId === nodeId);
  }

  function selectNode(nodeId: string, event: MouseEvent) {
    if (event.shiftKey) {
      selectionStore.update(sel => [...sel, { type: 'model', modelId: nodeId }]);
    } else {
      selectionStore.set([{ type: 'model', modelId: nodeId }]);
    }
  }

  function getNodeIcon(type: string): string {
    const icons: Record<string, string> = {
      sketch: '✎',
      box: '□',
      sphere: '○',
      cylinder: '⬭',
      default: '•'
    };
    return icons[type] || icons.default;
  }
</script>

<aside class="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
  <!-- Header -->
  <div class="h-10 bg-slate-900 border-b border-slate-700 flex items-center px-3">
    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Model Tree</span>
  </div>

  <!-- Tree Content -->
  <div class="flex-1 overflow-y-auto p-2">
    {#if nodes.length === 0}
      <div class="text-center py-8 text-slate-500 text-sm">
        <p>No models yet</p>
        <p class="text-xs mt-2 opacity-60">Create a sketch to begin</p>
      </div>
    {:else}
      {#each nodes as node (node.id)}
        <button
          class="w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors mb-1 {isSelected(node.id) ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}"
          onclick={(e) => selectNode(node.id, e)}
        >
          <span class="text-base opacity-70">{getNodeIcon(node.type)}</span>
          <span class="flex-1 text-left truncate">{node.name}</span>
          {#if !node.visible}
            <span class="text-xs opacity-50">👁‍🗨</span>
          {/if}
          {#if node.locked}
            <span class="text-xs opacity-50">🔒</span>
          {/if}
        </button>
      {/each}
    {/if}
  </div>

  <!-- Planes Section -->
  <div class="border-t border-slate-700">
    <div class="h-8 bg-slate-900 flex items-center px-3">
      <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Planes</span>
    </div>
    <div class="p-2">
      {#each Array.from($documentStore.planes.values()) as plane (plane.id)}
        <button
          class="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors mb-1 hover:bg-slate-700 {$documentStore.activePlaneId === plane.id ? 'bg-slate-700' : ''}"
        >
          <span class="text-cyan-400">◇</span>
          <span class="flex-1 text-left text-slate-300">{plane.name}</span>
        </button>
      {/each}
    </div>
  </div>
</aside>