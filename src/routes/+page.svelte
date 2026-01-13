<script>
  import { Canvas } from '@threlte/core'
  import { World } from '@threlte/rapier'
  
  import Scene from '$lib/Scene.svelte'
</script>

<div>
  <Canvas shadows>
    <World>
      <Scene />
    </World>
  </Canvas>
</div>

<style>
  div {
    position: relative;
    width: 100%;
    height: 50%;
    background: #fafbfc;
    border: 1px solid #161616;
  }
</style>