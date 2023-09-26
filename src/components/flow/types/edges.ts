import type { Edge } from 'reactflow';

export enum FlowEdgeType {
  DEFAULT = 'defaultEdge',
  BEIZER = 'beizerEdge',
  SMART_BEIZER = 'smartBeizerEdge',
}

export type FlowEdge<T = unknown> = Edge<T>;
