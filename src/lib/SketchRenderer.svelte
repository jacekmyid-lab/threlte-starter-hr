<script lang="ts">
  import { T } from '@threlte/core';
  import * as THREE from 'three';
  import { sketchEditStore, documentStore } from '../lib/stores';
  import type { Plane, Point2D, SketchEntity } from '../lib/types';

  export let plane: Plane;

  let sketch = $derived(
    $sketchEditStore.sketchId 
      ? $documentStore.nodes.find(n => n.id === $sketchEditStore.sketchId && n.type === 'sketch')
      : null
  );

  let entities = $derived(sketch?.type === 'sketch' ? sketch.entities : []);

  const COLORS = {
    normal: '#06b6d4',
    selected: '#f59e0b',
    hovered: '#22c55e',
    construction: '#6366f1',
    point: '#ffffff'
  };

  function to3D(p: Point2D): THREE.Vector3 {
    const origin = new THREE.Vector3(plane.origin.x, plane.origin.y, plane.origin.z);
    const xAxis = new THREE.Vector3(plane.xAxis.x, plane.xAxis.y, plane.xAxis.z);
    const yAxis = new THREE.Vector3(plane.yAxis.x, plane.yAxis.y, plane.yAxis.z);
    
    return origin.clone()
      .add(xAxis.clone().multiplyScalar(p.x))
      .add(yAxis.clone().multiplyScalar(p.y));
  }

  function createLineGeometry(points: THREE.Vector3[]): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(points);
    return geometry;
  }

  function circlePoints(center: Point2D, radius: number, segments = 64): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const p2d: Point2D = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
      };
      points.push(to3D(p2d));
    }
    return points;
  }

  function rectanglePoints(corner: Point2D, width: number, height: number): THREE.Vector3[] {
    const corners: Point2D[] = [
      corner,
      { x: corner.x + width, y: corner.y },
      { x: corner.x + width, y: corner.y + height },
      { x: corner.x, y: corner.y + height },
      corner
    ];
    return corners.map(c => to3D(c));
  }
</script>

{#each entities as entity (entity.id)}
  {@const color = entity.construction ? COLORS.construction : COLORS.normal}
  
  {#if entity.type === 'line'}
    {@const points = [to3D(entity.start), to3D(entity.end)]}
    <T.Line geometry={createLineGeometry(points)}>
      <T.LineBasicMaterial {color} linewidth={2} />
    </T.Line>
    
    <!-- Endpoints -->
    <T.Points>
      <T.BufferGeometry>
        <T.BufferAttribute
          attach="attributes-position"
          args={[new Float32Array([...points[0].toArray(), ...points[1].toArray()]), 3]}
        />
      </T.BufferGeometry>
      <T.PointsMaterial color={COLORS.point} size={4} sizeAttenuation={false} />
    </T.Points>
    
  {:else if entity.type === 'circle'}
    {@const points = circlePoints(entity.center, entity.radius)}
    <T.Line geometry={createLineGeometry(points)}>
      <T.LineBasicMaterial {color} linewidth={2} />
    </T.Line>
    
    <!-- Center point -->
    <T.Points>
      <T.BufferGeometry>
        <T.BufferAttribute
          attach="attributes-position"
          args={[new Float32Array(to3D(entity.center).toArray()), 3]}
        />
      </T.BufferGeometry>
      <T.PointsMaterial color={COLORS.point} size={4} sizeAttenuation={false} />
    </T.Points>
    
  {:else if entity.type === 'rectangle'}
    {@const points = rectanglePoints(entity.corner, entity.width, entity.height)}
    <T.Line geometry={createLineGeometry(points)}>
      <T.LineBasicMaterial {color} linewidth={2} />
    </T.Line>
    
    <!-- Corner points -->
    <T.Points>
      <T.BufferGeometry>
        <T.BufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.slice(0, 4).flatMap(p => p.toArray())), 3]}
        />
      </T.BufferGeometry>
      <T.PointsMaterial color={COLORS.point} size={4} sizeAttenuation={false} />
    </T.Points>
  {/if}
{/each}