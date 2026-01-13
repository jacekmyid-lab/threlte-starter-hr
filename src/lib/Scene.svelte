<script>
  import { T, useTask } from '@threlte/core'
  import { interactivity, OrbitControls, } from '@threlte/extras'
  import { Spring } from 'svelte/motion'
  import { elasticOut } from 'svelte/easing'
  interactivity()
  
  let scale = new Spring(0, { damping: 0.25, stiffness: 0.2, })
  let rotation = $state(0)

  useTask((delta) => {
    rotation += delta / 3
  })

  // Sets scale to 1 when component is first rendered
  $effect(() => {
    scale.set(1)
  })

</script>

<!-- CAMERA -->
<T.PerspectiveCamera
  makeDefault
  position={[0, 1, 12]}
  fov={44}
>
  <OrbitControls enableDamping />
</T.PerspectiveCamera>

<!-- LIGHTS -->
<T.DirectionalLight position={[5, 8, -1]} castShadow />
<T.AmbientLight color="aliceblue" />

<!-- FLOOR -->
<T.Mesh rotation.x={-Math.PI / 2} position={[0, -1, 0]} receiveShadow>
  <T.BoxGeometry args={[10, 5, 0.125]} />
  <T.MeshStandardMaterial 
    color="#fff"
    roughness={0.15}/>
</T.Mesh>

<!-- MESHES -->
<T.Mesh
  rotation.x={rotation}
  position={[-2, 0, 0]}
  scale={scale.current}
  castShadow
>
  <T.IcosahedronGeometry />
  <T.MeshBasicMaterial 
    color="#fe3d00" 
    flatShading
  />
</T.Mesh>
<T.Mesh
  rotation.y={rotation}
  scale={scale.current}
  castShadow
>
  <T.IcosahedronGeometry />
  <T.MeshNormalMaterial />
</T.Mesh>
<T.Mesh
  rotation.z={rotation}
  position={[2, 0, 0]}
  scale={scale.current}
  castShadow
>
  <T.IcosahedronGeometry />
  <T.MeshStandardMaterial 
    color="#fe3d00" 
    flatShading
  />
</T.Mesh>
