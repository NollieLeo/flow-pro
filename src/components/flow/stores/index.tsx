import React, { useState, createContext, useContext, FC, useMemo } from "react";
import { FlowProps } from "../types";
import { FlowNode } from "../types/nodes";
import { getIncomers, getOutgoers, useReactFlow } from "reactflow";
import { DRAGGABLE_NODE_TYPES, DROPPABLE_NODE_TYPES } from "../constants";
import { useRafState } from "ahooks";

interface FlowContext extends Omit<FlowProps, "children"> {
  selectedNodeId: string;
  setSelectedNodeId?: React.Dispatch<React.SetStateAction<string>>;
  draggingNode?: FlowNode;
  setDraggingNode?: React.Dispatch<React.SetStateAction<FlowNode | undefined>>;
  draggingNodeChildrenIds: FlowNode["id"][];
  draggingNodeSiblingIds: FlowNode["id"][];
  draggableNodeTypes: string[];
  droppableNodeTypes: string[];
}

export const FlowContext = createContext<FlowContext>({
  selectedNodeId: "",
  nodes: [],
  edges: [],
  draggingNodeChildrenIds: [],
  draggingNodeSiblingIds: [],
  draggableNodeTypes: [],
  droppableNodeTypes: [],
});

export function useEventsFlowContext(): FlowContext {
  return useContext(FlowContext);
}

export const FlowContextProvider: FC<FlowProps> = (props) => {
  const {
    children,
    draggableNodeTypes = DRAGGABLE_NODE_TYPES,
    droppableNodeTypes = DROPPABLE_NODE_TYPES,
    ...rest
  } = props;

  const [selectedNodeId, setSelectedNodeId] = useState("");

  const [draggingNode, setDraggingNode] = useRafState<FlowNode>();

  const { getNodes, getEdges } = useReactFlow();

  const draggingNodeChildrenIds = useMemo(() => {
    const allNodes = getNodes();
    const allEdges = getEdges();
    const childNodeIds: FlowNode["id"][] = [];
    if (!draggingNode) {
      return childNodeIds;
    }

    const nodeTraversal = (node: FlowNode) => {
      if (draggingNode.id !== node.id) {
        childNodeIds.push(node.id);
      }
      const curNodeChildren = getOutgoers(node, allNodes, allEdges);
      curNodeChildren.forEach((childNode) => {
        nodeTraversal(childNode);
      });
    };

    nodeTraversal(draggingNode);
    return childNodeIds;
  }, [getNodes, getEdges, draggingNode?.id]);

  const draggingNodeSiblingIds = useMemo(() => {
    const allNodes = getNodes();
    const allEdges = getEdges();
    const siblingNodeIds: FlowNode["id"][] = [];
    if (!draggingNode) {
      return siblingNodeIds;
    }

    const draggingNodeParent = getIncomers(
      draggingNode,
      allNodes,
      allEdges
    ).filter(Boolean)[0];

    const siblingNodes = getOutgoers(
      draggingNodeParent,
      allNodes,
      allEdges
    ).filter((node) => node.id !== draggingNode.id);

    siblingNodeIds.push(...siblingNodes.map((node) => node.id));

    return siblingNodeIds;
  }, [getNodes, getEdges, draggingNode?.id]);

  const params = {
    selectedNodeId,
    setSelectedNodeId,
    draggingNode,
    setDraggingNode,
    draggingNodeChildrenIds,
    draggingNodeSiblingIds,
    draggableNodeTypes,
    droppableNodeTypes,
    ...rest,
  };

  return <FlowContext.Provider value={params}>{children}</FlowContext.Provider>;
};
