import type { Node, NodeProps } from 'reactflow';

export enum FlowNodeType {
  START = 'startNode',
  PROCESS = 'processNode',
  CONDITION = 'conditionNode',
  CONDITION_SUCCESS = 'conditionSuccessNode',
  CONDITION_ERROR = 'conditionErrorNode',
  EMPTY = 'emptyNode',
  GROUP = 'groupNode',
  CONDITIONAL = 'conditionalNode',
  END = 'endNode',
  BUTTON = 'buttonNode',
}

export interface FlowNodeDataWithActions {
  onAdd: (...args: any[]) => void;
  onDelete: (...args: any[]) => void;
  onUpdate: (...args: any[]) => void;
  onCopy: (...args: any[]) => void;
}

export interface FlowNodeDataWithLabel {
  label: string;
  describe: string;
  icon: string;
}

export interface FlowNodeDataWithPriorityInfo {
  layer: number;
  order: number;
}

export type FlowNodeData = Partial<FlowNodeDataWithLabel> &
  Partial<FlowNodeDataWithActions> &
  Partial<FlowNodeDataWithPriorityInfo>;

export type FlowNodeComponentProps<D = FlowNodeData> = NodeProps<D>;

export type FlowNode<
  D = FlowNodeData,
  T extends FlowNodeType | string | undefined = FlowNodeType | string
> = Node<D, T>;

export function isFlowNode(nodeType?: any): nodeType is FlowNodeType {
  return Object.keys(FlowNodeType).includes(nodeType);
}
