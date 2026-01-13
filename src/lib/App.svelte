<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { onMount } from 'svelte';
  import Scene from './Scene.svelte';
  import Toolbar from '../components/Toolbar.svelte';
  import LeftPanel from '../components/LeftPanel.svelte';
  import RightPanel from '../components/RightPanel.svelte';
  import StatusBar from '../components/StatusBar.svelte';
  import { initializeManifold, testManifold, isManifoldReady } from '../lib/manifoldTest';

  let initialized = $state(false);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let testResult = $state<string | null>(null);

  onMount(async () => {
    try {
      console.log('[App] Initializing Manifold...');
      
      const initResult = await initializeManifold();
      if (!initResult.success) {
        error = initResult.error || 'Initialization failed';
        loading = false;
        return;
      }

      console.log('[App] Running Manifold tests...');
      const testRes = await testManifold();
      
      if (testRes.success) {
        testResult = testRes.value || 'Tests passed';
        initialized = true;
        
        // Hide loading screen after 2 seconds
        setTimeout(() => {
          loading = false;
        }, 2000);
      } else {
        error = testRes.error || 'Tests failed';
        loading = false;
      }
      
    } catch (err) {
      console.error('[App] Error:', err);
      error = err instanceof Error ? err.message : String(err);
      loading = false;
    }
  });
</script>

{#if loading}
  <!-- Loading/Test Screen -->
  <div class="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
    <div class="text-center max-w-2xl px-8">
      <div class="text-blue-400 mb-6">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" class="mx-auto animate-pulse">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </div>
      
      <h1 class="text-3xl font-bold text-white mb-4">N1 CAD</h1>
      
      {#if error}
        <div class="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-4">
          <p class="text-red-300 font-semibold mb-2">⚠️ Initialization Error</p>
          <code class="text-xs text-red-200 block bg-black/30 p-3 rounded overflow-auto">
            {error}
          </code>
        </div>
      {:else if initialized && testResult}
        <div class="bg-green-900/30 border border-green-600 rounded-lg p-4 mb-4">
          <p class="text-green-300 font-semibold mb-2">✓ Manifold-3D Ready</p>
          <pre class="text-xs text-green-200 text-left bg-black/30 p-3 rounded overflow-auto whitespace-pre-wrap">
{testResult}
          </pre>
        </div>
        <p class="text-slate-400 text-sm animate-pulse">Starting application...</p>
      {:else}
        <div class="flex items-center justify-center gap-3 text-slate-400">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
        <p class="text-slate-400 text-sm mt-4">Initializing Manifold-3D WASM...</p>
      {/if}
    </div>
  </div>
{/if}

{#if initialized}
  <!-- Main Application -->
  <div class="fixed inset-0 flex flex-col bg-slate-900 overflow-hidden">
    <!-- Toolbar -->
    <Toolbar />

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Panel -->
      <LeftPanel />

      <!-- Viewport -->
      <div class="flex-1 relative">
        <Canvas>
          <Scene />
        </Canvas>
        
        <!-- Viewport Overlay -->
        <div class="absolute top-3 left-3 pointer-events-none">
          <div class="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span class="text-slate-300">Manifold Ready</span>
            </div>
          </div>
        </div>

        <!-- Keyboard Shortcuts -->
        <div class="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2 pointer-events-none">
          <div class="flex gap-4 text-[10px] text-slate-400">
            <span><kbd class="bg-slate-800 px-1.5 py-0.5 rounded">M</kbd> Model</span>
            <span><kbd class="bg-slate-800 px-1.5 py-0.5 rounded">F</kbd> Face</span>
            <span><kbd class="bg-slate-800 px-1.5 py-0.5 rounded">E</kbd> Edge</span>
            <span><kbd class="bg-slate-800 px-1.5 py-0.5 rounded">V</kbd> Vertex</span>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <RightPanel />
    </div>

    <!-- Status Bar -->
    <StatusBar />
  </div>
{/if}