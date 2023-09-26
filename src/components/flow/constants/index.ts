import { FlowNodeType } from '../types/nodes';
import { CSSProperties } from 'react';

export const DEFAULT_LAYOUT_CONFIG = {
  nodesep: 40,
  ranksep: 30,
  align: undefined,
} as const;

export const DEFAULT_EDGE_STYLE: CSSProperties = {
  background: 'rgba(72, 72, 72, 1)',
  strokeWidth: '2px',
} as const;

export const DEFAULT_EDGE_OPTION = {
  type: 'smoothstep',
  pathOptions: { offset: 10 },
} as const;

export const DEFAULT_EVENT_FLOW_OPTIONS = {
  fitView: true,
  fitViewOptions: {
    duration: 200,
    maxZoom: 1,
  },
  maxZoom: 5,
  minZoom: 0.2,
  panOnScroll: true,
  panOnDrag: false,
  elementsSelectable: false,
  nodesDraggable: false,
  panOnScrollSpeed: 1.2,
  zoomOnDoubleClick: false,
  defaultEdgeOptions: DEFAULT_EDGE_OPTION,
  proOptions: {
    hideAttribution: true,
  },
  defaultViewport: {
    x: 0,
    y: 0,
    zoom: 1,
  },
} as const;

export const DRAGGABLE_NODE_TYPES: string[] = [
  FlowNodeType.PROCESS,
  FlowNodeType.GROUP,
  FlowNodeType.CONDITION,
  FlowNodeType.CONDITIONAL,
];

export const DROPPABLE_NODE_TYPES: string[] = [
  FlowNodeType.PROCESS,
  FlowNodeType.GROUP,
  FlowNodeType.CONDITION,
  FlowNodeType.CONDITIONAL,
];

export const HIDDEN_ADDON_BTN_NODE_TYEPS: string[] = [FlowNodeType.END, FlowNodeType.EMPTY];

export const NODE_DEFAULT_SIZE = {
  width: 140,
  height: 40,
} as const;

export const NODE_SIZE_MAP: Record<
  string,
  {
    width: number;
    height: number;
  }
> = {
  [FlowNodeType.START]: {
    width: 160,
    height: 54,
  },
  [FlowNodeType.END]: {
    width: 160,
    height: 54,
  },
  [FlowNodeType.BUTTON]: {
    width: 26,
    height: 26,
  },
  [FlowNodeType.PROCESS]: {
    width: 200,
    height: 60,
  },
  [FlowNodeType.CONDITION]: {
    width: 140,
    height: 40,
  },
  [FlowNodeType.CONDITION_SUCCESS]: {
    width: 140,
    height: 40,
  },
  [FlowNodeType.CONDITION_ERROR]: {
    width: 140,
    height: 40,
  },
  [FlowNodeType.CONDITIONAL]: {
    width: 140,
    height: 40,
  },
  [FlowNodeType.GROUP]: {
    width: 120,
    height: 42,
  },
  [FlowNodeType.EMPTY]: {
    width: 0,
    height: 0,
  },
} as const;
