import { ReactNode } from 'react';
import { FlowNode } from '../types/nodes';
import { FlowEdge } from '../types/edges';
import { EdgeTypes, NodeTypes } from 'reactflow';

export interface FlowProps<N = FlowNode, E = FlowEdge> {
  children?: ReactNode;
  nodes: N[];
  edges: E[];
  draggableNodeTypes?: string[];
  droppableNodeTypes?: string[];
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  onNodeSelect?: (node: N) => void;
  onNodeDrag?: (node: N) => void;
  onNodeDragEnd?: (sourceNode: N, destinationNode?: N) => void;
  onNodeDelete?: (targetNode: N) => void;
  customNodeAddButton?: (node: N, defaultButton: ReactNode) => React.ReactNode;
  customNodeOperationButton?: (node: N) => React.ReactNode;
}
