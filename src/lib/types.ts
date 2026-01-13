// Core types for CAD application

export type Vec3 = {
    x: number;
    y: number;
    z: number;
  };
  
  export type Point2D = {
    x: number;
    y: number;
  };
  
  export type Plane = {
    id: string;
    name: string;
    origin: Vec3;
    xAxis: Vec3;
    yAxis: Vec3;
    normal: Vec3;
  };
  
  export type SelectionMode = 'model' | 'face' | 'edge' | 'vertex';
  
  export type Tool = 
    | 'select' 
    | 'sketch-line' 
    | 'sketch-circle' 
    | 'sketch-rectangle' 
    | 'sketch-arc';
  
  export type SelectionItem = {
    type: SelectionMode;
    modelId: string;
    elementId?: string;
  };
  
  // Sketch entity types
  export type SketchLine = {
    id: string;
    type: 'line';
    start: Point2D;
    end: Point2D;
    construction: boolean;
  };
  
  export type SketchCircle = {
    id: string;
    type: 'circle';
    center: Point2D;
    radius: number;
    construction: boolean;
  };
  
  export type SketchRectangle = {
    id: string;
    type: 'rectangle';
    corner: Point2D;
    width: number;
    height: number;
    construction: boolean;
  };
  
  export type SketchArc = {
    id: string;
    type: 'arc';
    center: Point2D;
    radius: number;
    startAngle: number;
    endAngle: number;
    construction: boolean;
  };
  
  export type SketchEntity = SketchLine | SketchCircle | SketchRectangle | SketchArc;
  
  // Node types
  export type BaseNode = {
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
  };
  
  export type SketchNode = BaseNode & {
    type: 'sketch';
    planeId: string;
    plane: Plane;
    entities: SketchEntity[];
  };
  
  export type SolidNode = BaseNode & {
    type: 'box' | 'sphere' | 'cylinder';
    geometry?: any;
  };
  
  export type CADNode = SketchNode | SolidNode;
  
  // Store types
  export type DocumentState = {
    nodes: CADNode[];
    planes: Map<string, Plane>;
    activePlaneId: string | null;
  };
  
  export type SketchEditState = {
    isEditing: boolean;
    sketchId: string | null;
    planeId: string | null;
  };
  
  export type ToolState = {
    activeTool: Tool;
  };
  
  export type ViewportState = {
    showGrid: boolean;
    showAxes: boolean;
    showOrigin: boolean;
  };