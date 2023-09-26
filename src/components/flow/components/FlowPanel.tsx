import { FlowNode, FlowNodeData, FlowNodeType } from "../types/nodes";
import { FlowEdgeType } from "../types/edges";

import { FC, MouseEventHandler, useMemo, useState } from "react";
import {
  ReactFlow,
  useEdgesState,
  useReactFlow,
  useNodesState,
  OnMove,
  OnNodesChange,
  NodeDragHandler,
  NodeMouseHandler,
  NodeTypes,
} from "reactflow";
import moduleScss from "../components/FlowPanel.module.scss";
import { DEFAULT_EVENT_FLOW_OPTIONS } from "../constants";
import "reactflow/dist/style.css";
import {
  ConditionErrorNode,
  ConditionNode,
  ConditionSuccessNode,
} from "../components/custom-nodes/ConditionNode";
import { EmptyNode } from "../components/custom-nodes/EmptyNode";
import { GroupNode } from "../components/custom-nodes/GroupNode";
import { ProcessNode } from "../components/custom-nodes/ProcessNode";
import { StartNode } from "../components/custom-nodes/StartNode";
import { DefaultEdge } from "../components/custom-edges/DefaultEdge";
import { useAutoLayout } from "../hooks/useAutoLayout";
import { useEventsFlowContext } from "../stores";
import { MinusOutlined, PlusOutlined, AimOutlined } from "@ant-design/icons";
import { ConditionalNode } from "../components/custom-nodes/ConditionalNode";
import classNames from "classnames";
import "../components/FlowPanel.scss";
import { useRafState, useMount, useKeyPress } from "ahooks";
import { KEY_BACK_SPACE } from "keycode-js";
import { EndNode } from "../components/custom-nodes/EndNode";
import { BezierEdge } from "../components/custom-edges/BezierEdge";
import { ButtonNode } from "../components/custom-nodes/ButtonNode";
import { SmartBezierEdge } from "../components/custom-edges/SmartBizerEdge";

export interface DrawerInfo {
  visible: boolean;
  node?: FlowNode;
}

const CUSTOM_NODE_TYPES_MAP: NodeTypes = {
  [FlowNodeType.START]: StartNode,
  [FlowNodeType.PROCESS]: ProcessNode,
  [FlowNodeType.CONDITION]: ConditionNode,
  [FlowNodeType.CONDITION_SUCCESS]: ConditionSuccessNode,
  [FlowNodeType.CONDITION_ERROR]: ConditionErrorNode,
  [FlowNodeType.EMPTY]: EmptyNode,
  [FlowNodeType.GROUP]: GroupNode,
  [FlowNodeType.CONDITIONAL]: ConditionalNode,
  [FlowNodeType.END]: EndNode,
  [FlowNodeType.BUTTON]: ButtonNode,
};

const CUSTOM_EDGE_TYPES_MAP = {
  [FlowEdgeType.DEFAULT]: DefaultEdge,
  [FlowEdgeType.BEIZER]: BezierEdge,
  [FlowEdgeType.SMART_BEIZER]: SmartBezierEdge,
};

enum NodeChangeType {
  POSITION = "position",
  DIMENSIONS = "dimensions",
}

const FlowPanel: FC = () => {
  const { fitView, zoomOut, zoomIn, getNode } = useReactFlow();

  const {
    setDraggingNode,
    draggingNode,
    onNodeDrag,
    onNodeDragEnd,
    onNodeDelete,
    draggableNodeTypes,
    droppableNodeTypes,
    selectedNodeId,
    draggingNodeSiblingIds,
    nodeTypes,
    edgeTypes,
  } = useEventsFlowContext();

  useAutoLayout({ direction: "TB" });

  const [nodes, , onNodesChange] = useNodesState<FlowNodeData>([]);
  const [edges, , onEdgesChange] = useEdgesState<FlowNodeData>([]);

  const [zoomRate, setZoomRate] = useRafState<number>(0);

  const [draggingDestinationNode, setDraggingDestinationNode] =
    useState<FlowNode>();

  const zoomPercent = `${Math.floor(zoomRate * 100)}%`;

  const flowClassName = classNames(moduleScss.reactFlow, "reactFlow");

  const flowNodeTypes = useMemo(() => {
    let baseNodeTypes = { ...CUSTOM_NODE_TYPES_MAP };
    if (nodeTypes && Object.keys(nodeTypes).length) {
      baseNodeTypes = {
        ...baseNodeTypes,
        ...nodeTypes,
      };
    }
    return baseNodeTypes;
  }, []);

  const flowEdgeTypes = useMemo(() => {
    let baseEdgeTypes = { ...CUSTOM_EDGE_TYPES_MAP };
    if (edgeTypes && Object.keys(edgeTypes).length) {
      baseEdgeTypes = {
        ...baseEdgeTypes,
        ...edgeTypes,
      };
    }
    return baseEdgeTypes;
  }, []);

  useMount(handleFitView);

  useKeyPress(
    [KEY_BACK_SPACE],
    (e) => {
      e.stopPropagation();
      const selectedNode = getNode(selectedNodeId);
      if (selectedNode) {
        onNodeDelete?.(selectedNode);
      }
    },
    {
      useCapture: true,
    }
  );

  function handleFitView() {
    return fitView(DEFAULT_EVENT_FLOW_OPTIONS.fitViewOptions);
  }

  const handlePaneMoving: OnMove = (_event, viewport) => {
    const { zoom: newZoomRate } = viewport;
    if (newZoomRate !== zoomRate) {
      setZoomRate(newZoomRate);
    }
  };

  const handleNodeChange: OnNodesChange = (changes) => {
    const isMetPositionAndDraggingStart = changes.every(
      (change) => change.type === NodeChangeType.POSITION && change.dragging
    );
    if (isMetPositionAndDraggingStart) {
      return;
    }

    onNodesChange(changes);
  };

  const handleNodeDrag: NodeDragHandler = (_event, node) => {
    const isMetDraggableNodeType =
      node?.type && draggableNodeTypes.includes(node.type);
    if (isMetDraggableNodeType) {
      setDraggingNode?.(node);
      onNodeDrag?.(node);
    }
  };

  const handleNodeDragStop: NodeDragHandler = () => {
    if (draggingNode) {
      onNodeDragEnd?.(draggingNode, draggingDestinationNode);
    }
    setDraggingNode?.(undefined);
  };

  const handleNodeMouseEnter: NodeMouseHandler = (_event, node) => {
    const shouldSetDestinationNode =
      !!draggingNode &&
      node?.type &&
      droppableNodeTypes.includes(node.type) &&
      draggingNodeSiblingIds.includes(node.id);
    if (shouldSetDestinationNode) {
      setDraggingDestinationNode(node);
    }
  };

  const handleNodeMouseLeave: NodeMouseHandler = () => {
    if (draggingNode && draggingDestinationNode) {
      setDraggingDestinationNode(undefined);
    }
  };

  const handleHiddenContextMenu: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const renderFlowControls = () => {
    return (
      <div className={moduleScss.controls}>
        <div className={moduleScss.zoomControls}>
          <span className={moduleScss.button} onClick={() => zoomOut()}>
            <MinusOutlined />
          </span>
          <span className={moduleScss.zoomText}>{zoomPercent}</span>
          <span className={moduleScss.button} onClick={() => zoomIn()}>
            <PlusOutlined />
          </span>
        </div>
        <div className={moduleScss.subControls}>
          <span className={moduleScss.button} onClick={handleFitView}>
            <AimOutlined />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={moduleScss.container}
      data-comp-type="FlowPanel"
      onContextMenu={handleHiddenContextMenu}
    >
      <ReactFlow
        className={flowClassName}
        nodeTypes={flowNodeTypes}
        edgeTypes={flowEdgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodeChange}
        onEdgesChange={onEdgesChange}
        onMove={handlePaneMoving}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        {...DEFAULT_EVENT_FLOW_OPTIONS}
      />
      {renderFlowControls()}
    </div>
  );
};

export { FlowPanel };
