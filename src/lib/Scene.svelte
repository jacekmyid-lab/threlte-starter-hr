<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { viewportStore, isSketchMode, activePlane } from '../lib/stores';
  import SketchRenderer from './SketchRenderer.svelte';

  let showGrid = $derived($viewportStore.showGrid);
  let showAxes = $derived($viewportStore.showAxes);
  let sketching = $derived($isSketchMode);
  let plane = $derived($activePlane);
</script>

<!-- Camera -->
<T.PerspectiveCamera
  makeDefault
  position={[10, 10, 10]}
  fov={45}
  near={0.1}
  far={1000}
>
  <OrbitControls 
    enableDamping
    dampingFactor={0.1}
    rotateSpeed={0.5}
  />
</T.PerspectiveCamera>

<!-- Lights -->
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[10, 10, 10]} intensity={0.8} />
<T.DirectionalLight position={[-5, 5, -5]} intensity={0.4} />

<!-- Grid -->
{#if showGrid && !sketching}
  <T.GridHelper args={[100, 20, 0x2563eb, 0x1e3a5f]} />
{/if}

<!-- Axes -->
{#if showAxes}
  <T.AxesHelper args={[5]} />
{/if}

<!-- Origin -->
{#if $viewportStore.showOrigin}
  <T.Mesh position={[0, 0, 0]}>
    <T.SphereGeometry args={[0.1, 16, 16]} />
    <T.MeshBasicMaterial color="#ffffff" />
  </T.Mesh>
{/if}

<!-- Sketch Plane Visualization -->
{#if sketching && plane}
  {@const normal = plane.normal}
  {@const origin = plane.origin}
  
  <!-- Sketch Grid -->
  <T.Group position={[origin.x, origin.y, origin.z]}>
    <T.GridHelper args={[50, 25, 0x06b6d4, 0x0e7490]} />
    
    <!-- Plane Surface -->
    <T.Mesh rotation={[-Math.PI/2, 0, 0]}>
      <T.PlaneGeometry args={[50, 50]} />
      <T.MeshBasicMaterial 
        color="#06b6d4"
        transparent
        opacity={0.05}
        side={2}
      />
    </T.Mesh>
  </T.Group>

  <!-- Sketch Entities -->
  <SketchRenderer {plane} />
{/if}

<!-- Test Box (placeholder for future models) -->
<T.Mesh position={[0, 1, 0]} castShadow>
  <T.BoxGeometry args={[2, 2, 2]} />
  <T.MeshStandardMaterial color="#5588bb" />
</T.Mesh>

<!-- Ground -->
<T.Mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
  <T.CircleGeometry args={[50, 64]} />
  <T.MeshStandardMaterial color="#334155" />
</T.Mesh>