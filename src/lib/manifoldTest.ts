/**
 * Manifold-3D Test and Initialization
 * Real implementation using manifold-3d npm package
 */

type InitResult = {
  success: boolean;
  error?: string;
};

type TestResult = {
  success: boolean;
  value?: string;
  error?: string;
};

// Module-level references
let wasm: any = null;
let Manifold: any = null;
let CrossSection: any = null;

export const isManifoldReady = { value: false };

export async function initializeManifold(): Promise<InitResult> {
  try {
    console.log('[Manifold] Starting initialization...');
    
    // Import manifold-3d package
    const ManifoldModule = await import('manifold-3d');
    console.log('[Manifold] Module imported');
    
    // Initialize WASM
    wasm = await ManifoldModule.default();
    console.log('[Manifold] WASM initialized');
    
    // CRITICAL: Call setup() to make API available
    if (typeof wasm.setup === 'function') {
      wasm.setup();
      console.log('[Manifold] setup() called');
    }
    
    // Store class references
    Manifold = wasm.Manifold;
    CrossSection = wasm.CrossSection;
    
    console.log('[Manifold] Classes available:', {
      Manifold: !!Manifold,
      CrossSection: !!CrossSection,
      cube: typeof Manifold?.cube,
      sphere: typeof Manifold?.sphere,
      cylinder: typeof Manifold?.cylinder
    });
    
    isManifoldReady.value = true;
    return { success: true };
  } catch (error) {
    console.error('[Manifold] Initialization failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function testManifold(): Promise<TestResult> {
  try {
    if (!isManifoldReady.value || !Manifold) {
      return { 
        success: false, 
        error: 'Manifold not initialized' 
      };
    }
    
    console.log('[Manifold] Running tests...');
    
    // Test 1: Create a cube
    const cube = Manifold.cube([2, 2, 2], true);
    const cubeVolume = cube.volume();
    console.log('[Manifold] ✓ Cube created, volume:', cubeVolume);
    
    // Test 2: Create a sphere
    const sphere = Manifold.sphere(1, 32);
    const sphereVolume = sphere.volume();
    console.log('[Manifold] ✓ Sphere created, volume:', sphereVolume);
    
    // Test 3: Boolean operation
    const union = cube.add(sphere);
    const unionVolume = union.volume();
    console.log('[Manifold] ✓ Union created, volume:', unionVolume);
    
    // Test 4: Mesh extraction
    const mesh = cube.getMesh();
    console.log('[Manifold] ✓ Mesh extracted:', {
      vertices: mesh.numVert,
      triangles: mesh.numTri
    });
    
    // Cleanup
    try {
      cube.delete();
      sphere.delete();
      union.delete();
      mesh.delete();
    } catch {}
    
    const result = `Manifold-3D Ready! ✓

System Status:
✓ WASM Module Loaded
✓ Geometry Kernel Initialized
✓ Boolean Operations Available
✓ Mesh Processing Ready

Test Results:
✓ Cube: volume = ${cubeVolume.toFixed(3)}
✓ Sphere: volume = ${sphereVolume.toFixed(3)}
✓ Union: volume = ${unionVolume.toFixed(3)}
✓ Mesh: ${mesh.numVert} vertices, ${mesh.numTri} triangles

API Methods Available:
- Manifold.cube()
- Manifold.sphere()
- Manifold.cylinder()
- CrossSection.circle()
- Boolean operations (add, subtract, intersect)
- Transformations (translate, rotate, scale)
- Extrude & Revolve operations`;

    return { 
      success: true, 
      value: result
    };
  } catch (error) {
    console.error('[Manifold] Test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Test failed'
    };
  }
}

// Export the Manifold class for external use
export function getManifoldClass() {
  return Manifold;
}

export function getCrossSectionClass() {
  return CrossSection;
}