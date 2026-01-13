/**
 * ManifoldEngine - WASM wrapper for manifold-3d library
 */

export type Result<T> = 
  | { success: true; value: T }
  | { success: false; error: string };

export type Point2D = { x: number; y: number };
export type Point3D = { x: number; y: number; z: number };

export type BoxParams = {
  width: number;
  height: number;
  depth: number;
  center?: boolean;
};

export type SphereParams = {
  radius: number;
  circularSegments?: number;
};

export type CylinderParams = {
  radius: number;
  height: number;
  circularSegments?: number;
  center?: boolean;
};

export type ConeParams = {
  bottomRadius: number;
  topRadius: number;
  height: number;
  circularSegments?: number;
  center?: boolean;
};

export type TorusParams = {
  majorRadius: number;
  minorRadius: number;
  majorSegments?: number;
  minorSegments?: number;
};

export type BooleanOperation = 'union' | 'difference' | 'intersection';

// Module-level references
let wasm: any = null;
let Manifold: any = null;
let CrossSection: any = null;
let ManifoldMesh: any = null;

interface ManifoldEngineConfig {
  circularSegments: number;
  epsilon: number;
}

const defaultConfig: ManifoldEngineConfig = {
  circularSegments: 32,
  epsilon: 1e-6
};

export class ManifoldEngine {
  private static instance: ManifoldEngine | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private config: ManifoldEngineConfig;

  private constructor(config: Partial<ManifoldEngineConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  static getInstance(config?: Partial<ManifoldEngineConfig>): ManifoldEngine {
    if (!ManifoldEngine.instance) {
      ManifoldEngine.instance = new ManifoldEngine(config);
    }
    return ManifoldEngine.instance;
  }

  async initialize(): Promise<Result<void>> {
    if (this.initialized) {
      return { success: true, value: undefined };
    }
    if (this.initPromise) {
      await this.initPromise;
      return { success: true, value: undefined };
    }

    this.initPromise = this.doInitialize();
    try {
      await this.initPromise;
      return { success: true, value: undefined };
    } catch (error) {
      return { success: false, error: `Initialization failed: ${error}` };
    }
  }

  private async doInitialize(): Promise<void> {
    try {
      console.log('[ManifoldEngine] Starting WASM initialization...');

      // Import manifold-3d
      console.log('[ManifoldEngine] Importing manifold-3d module...');
      const ManifoldModule = await import('manifold-3d');
      console.log('[ManifoldEngine] Module imported successfully');

      // Initialize WASM
      console.log('[ManifoldEngine] Initializing WASM...');
      wasm = await ManifoldModule.default();
      console.log('[ManifoldEngine] WASM initialized:', !!wasm);

      // Call setup()
      if (typeof wasm.setup === 'function') {
        console.log('[ManifoldEngine] Calling setup()...');
        wasm.setup();
        console.log('[ManifoldEngine] setup() completed');
      } else {
        console.warn('[ManifoldEngine] No setup() function found');
      }

      // Store class references
      Manifold = wasm.Manifold;
      CrossSection = wasm.CrossSection;
      ManifoldMesh = wasm.Mesh;

      console.log('[ManifoldEngine] Class references:', {
        hasManifold: !!Manifold,
        hasCrossSection: !!CrossSection,
        hasMesh: !!ManifoldMesh
      });

      // Verify API
      console.log('[ManifoldEngine] API verification:');
      console.log('  - Manifold.cube:', typeof Manifold?.cube);
      console.log('  - Manifold.sphere:', typeof Manifold?.sphere);
      console.log('  - Manifold.cylinder:', typeof Manifold?.cylinder);
      console.log('  - CrossSection.circle:', typeof CrossSection?.circle);

      // Set circular segments
      if (typeof wasm.setCircularSegments === 'function') {
        wasm.setCircularSegments(this.config.circularSegments);
        console.log('[ManifoldEngine] Circular segments set to', this.config.circularSegments);
      }

      this.initialized = true;
      console.log('[ManifoldEngine] ✓ Initialization complete');
    } catch (error) {
      console.error('[ManifoldEngine] ✗ Initialization failed:', error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.initialized && wasm !== null && Manifold !== null;
  }

  getManifoldClass(): any {
    return Manifold;
  }

  getCrossSectionClass(): any {
    return CrossSection;
  }

  // PRIMITIVES
  createBox(params: BoxParams): Result<any> {
    if (!this.isReady()) {
      return { success: false, error: 'Manifold not initialized' };
    }

    try {
      const { width, height, depth, center } = params;
      const box = Manifold.cube([width, height, depth], center);
      return { success: true, value: box };
    } catch (error) {
      return { success: false, error: `Failed to create box: ${error}` };
    }
  }

  createSphere(params: SphereParams): Result<any> {
    if (!this.isReady()) {
      return { success: false, error: 'Manifold not initialized' };
    }

    try {
      const { radius, circularSegments } = params;
      const sphere = Manifold.sphere(radius, circularSegments || this.config.circularSegments);
      return { success: true, value: sphere };
    } catch (error) {
      return { success: false, error: `Failed to create sphere: ${error}` };
    }
  }

  createCylinder(params: CylinderParams): Result<any> {
    if (!this.isReady()) {
      return { success: false, error: 'Manifold not initialized' };
    }

    try {
      const { radius, height, circularSegments, center } = params;
      const cylinder = Manifold.cylinder(
        height,
        radius,
        radius,
        circularSegments || this.config.circularSegments,
        center
      );
      return { success: true, value: cylinder };
    } catch (error) {
      return { success: false, error: `Failed to create cylinder: ${error}` };
    }
  }

  createCone(params: ConeParams): Result<any> {
    if (!this.isReady()) {
      return { success: false, error: 'Manifold not initialized' };
    }

    try {
      const { bottomRadius, topRadius, height, circularSegments, center } = params;
      const cone = Manifold.cylinder(
        height,
        bottomRadius,
        topRadius,
        circularSegments || this.config.circularSegments,
        center
      );
      return { success: true, value: cone };
    } catch (error) {
      return { success: false, error: `Failed to create cone: ${error}` };
    }
  }

  createTorus(params: TorusParams): Result<any> {
    if (!this.isReady() || !CrossSection) {
      return { success: false, error: 'Manifold not initialized' };
    }

    try {
      const { majorRadius, minorRadius, majorSegments, minorSegments } = params;
      const cs = CrossSection.circle(minorRadius, minorSegments || 16);
      const translated = cs.translate(majorRadius, 0);
      const torus = translated.revolve(majorSegments || this.config.circularSegments, 360);
      
      try { if (cs?.delete) cs.delete(); } catch {}
      try { if (translated?.delete) translated.delete(); } catch {}
      
      return { success: true, value: torus };
    } catch (error) {
      return { success: false, error: `Failed to create torus: ${error}` };
    }
  }

  // BOOLEAN OPERATIONS
  union(a: any, b: any): Result<any> {
    if (!this.isReady()) return { success: false, error: 'Manifold not initialized' };
    try {
      return { success: true, value: a.add(b) };
    } catch (error) {
      return { success: false, error: `Union failed: ${error}` };
    }
  }

  difference(a: any, b: any): Result<any> {
    if (!this.isReady()) return { success: false, error: 'Manifold not initialized' };
    try {
      return { success: true, value: a.subtract(b) };
    } catch (error) {
      return { success: false, error: `Difference failed: ${error}` };
    }
  }

  intersection(a: any, b: any): Result<any> {
    if (!this.isReady()) return { success: false, error: 'Manifold not initialized' };
    try {
      return { success: true, value: a.intersect(b) };
    } catch (error) {
      return { success: false, error: `Intersection failed: ${error}` };
    }
  }

  // TRANSFORMATIONS
  translate(solid: any, offset: Point3D): Result<any> {
    if (!this.isReady()) return { success: false, error: 'Manifold not initialized' };
    try {
      return { success: true, value: solid.translate([offset.x, offset.y, offset.z]) };
    } catch (error) {
      return { success: false, error: `Translation failed: ${error}` };
    }
  }

  rotate(solid: any, rotation: Point3D): Result<any> {
    if (!this.isReady()) return { success: false, error: 'Manifold not initialized' };
    try {
      return { success: true, value: solid.rotate([rotation.x, rotation.y, rotation.z]) };
    } catch (error) {
      return { success: false, error: `Rotation failed: ${error}` };
    }
  }

  scale(solid: any, factor: Point3D | number): Result<any> {
    if (!this.isReady()) return { success: false, error: 'Manifold not initialized' };
    try {
      const scaleVec = typeof factor === 'number' 
        ? [factor, factor, factor] 
        : [factor.x, factor.y, factor.z];
      return { success: true, value: solid.scale(scaleVec) };
    } catch (error) {
      return { success: false, error: `Scaling failed: ${error}` };
    }
  }

  // MESH EXTRACTION
  extractMesh(solid: any): Result<{
    vertices: Float32Array;
    indices: Uint32Array;
    normals: Float32Array;
  }> {
    if (!this.isReady()) return { success: false, error: 'Manifold not initialized' };

    try {
      const mesh = solid.getMesh();
      const numVert = mesh.numVert;
      const numTri = mesh.numTri;
      const numProp = mesh.numProp || 3;
      
      const vertices = new Float32Array(numVert * 3);
      const indices = new Uint32Array(numTri * 3);
      const normals = new Float32Array(numVert * 3);
      
      // Copy vertices
      for (let i = 0; i < numVert; i++) {
        vertices[i * 3 + 0] = mesh.vertProperties[i * numProp + 0];
        vertices[i * 3 + 1] = mesh.vertProperties[i * numProp + 1];
        vertices[i * 3 + 2] = mesh.vertProperties[i * numProp + 2];
      }
      
      // Copy indices
      for (let i = 0; i < numTri * 3; i++) {
        indices[i] = mesh.triVerts[i];
      }
      
      // Calculate normals
      this.calculateNormals(vertices, indices, normals);
      
      try { if (mesh?.delete) mesh.delete(); } catch {}
      
      return { success: true, value: { vertices, indices, normals } };
    } catch (error) {
      return { success: false, error: `Mesh extraction failed: ${error}` };
    }
  }

  private calculateNormals(
    vertices: Float32Array,
    indices: Uint32Array,
    normals: Float32Array
  ): void {
    normals.fill(0);
    const numTri = indices.length / 3;
    
    for (let t = 0; t < numTri; t++) {
      const i0 = indices[t * 3 + 0];
      const i1 = indices[t * 3 + 1];
      const i2 = indices[t * 3 + 2];
      
      const v0x = vertices[i0 * 3 + 0], v0y = vertices[i0 * 3 + 1], v0z = vertices[i0 * 3 + 2];
      const v1x = vertices[i1 * 3 + 0], v1y = vertices[i1 * 3 + 1], v1z = vertices[i1 * 3 + 2];
      const v2x = vertices[i2 * 3 + 0], v2y = vertices[i2 * 3 + 1], v2z = vertices[i2 * 3 + 2];
      
      const ux = v1x - v0x, uy = v1y - v0y, uz = v1z - v0z;
      const vx = v2x - v0x, vy = v2y - v0y, vz = v2z - v0z;
      
      const nx = uy * vz - uz * vy;
      const ny = uz * vx - ux * vz;
      const nz = ux * vy - uy * vx;
      
      normals[i0 * 3 + 0] += nx; normals[i0 * 3 + 1] += ny; normals[i0 * 3 + 2] += nz;
      normals[i1 * 3 + 0] += nx; normals[i1 * 3 + 1] += ny; normals[i1 * 3 + 2] += nz;
      normals[i2 * 3 + 0] += nx; normals[i2 * 3 + 1] += ny; normals[i2 * 3 + 2] += nz;
    }
    
    const numVert = vertices.length / 3;
    for (let i = 0; i < numVert; i++) {
      const x = normals[i * 3 + 0], y = normals[i * 3 + 1], z = normals[i * 3 + 2];
      const len = Math.sqrt(x * x + y * y + z * z) || 1;
      normals[i * 3 + 0] = x / len;
      normals[i * 3 + 1] = y / len;
      normals[i * 3 + 2] = z / len;
    }
  }

  deleteManifold(solid: any): void {
    try {
      if (solid?.delete) solid.delete();
    } catch {}
  }
}

export const getManifoldEngine = ManifoldEngine.getInstance;
export const manifoldEngine = ManifoldEngine.getInstance();