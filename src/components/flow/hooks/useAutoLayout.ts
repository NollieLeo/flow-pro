import { useCallback, useEffect, useMemo } from 'react';
import { Position, useReactFlow } from 'reactflow';
import { FlowNode, FlowNodeData, FlowNodeType } from '../types/nodes';
import { find, isUndefined, map, pick } from 'lodash';
import { useEventsFlowContext } from '../stores';
import { genFlowNodeDragId } from '../utils';
import { DEFAULT_LAYOUT_CONFIG, NODE_DEFAULT_SIZE, NODE_SIZE_MAP } from '../constants';
import { DagreLayout } from '@antv/layout';
import { FlowEdge } from '../types/edges';
import { Direction } from '../types/layout';
import { POSITION_MAP } from '../constants/layout';

export function isDefined<T>(obj: T | undefined): obj is T {
  return !isUndefined(obj);
}

export type UseAutoLayoutOptions = {
  direction: Direction;
};

const getPosition = (treeNode: any, direction: Direction) => {
  const { x, y, width, height } = treeNode;
  const xPos = x - (width || 0) / 2;
  const yPos = y - (height || 0) / 2;
  switch (direction) {
    case 'LR':
      return { x: y, y: x };
    case 'RL':
      return { x: -y, y: -x };
    case 'BT':
      return {
        x: -xPos,
        y: -yPos,
      };
    default:
      return { x: xPos, y: yPos };
  }
};

const getRanksepByNodeType = (node: FlowNode) => {
  const { type } = node;
  switch (type) {
    case FlowNodeType.END:
      return 25;
    default:
      return DEFAULT_LAYOUT_CONFIG.ranksep;
  }
};

function useAutoLayout(options: UseAutoLayoutOptions) {
  const { direction } = options;

  const { setNodes, setEdges } = useReactFlow<FlowNodeData>();

  const { nodes, edges } = useEventsFlowContext();

  const dagreGraph = useMemo(
    () =>
      new DagreLayout({
        ...DEFAULT_LAYOUT_CONFIG,
        type: 'dagre',
        rankdir: direction, // 图的延展方向，可选： 'TB' | 'BT' | 'LR' | 'RL'
        ranksepFunc: getRanksepByNodeType,
        // nodeOrder: map(
        //   nodes.sort((pre, next) => (pre.data?.order || 0) - (next.data?.order || 0)),
        //   ({ id }) => id
        // ),
      }),
    [nodes, edges]
  );

  const nodesWithDefaultInfo = useMemo<FlowNode[]>(
    () =>
      map(nodes, (node) => {
        const { width, height, type, id, data } = node;
        const { layer, order } = data;
        const defaultNodeSize = type ? NODE_SIZE_MAP[type] : NODE_DEFAULT_SIZE;
        const nodeSize = width && height ? pick(node, ['width', 'height']) : defaultNodeSize;
        return {
          ...node,
          ...nodeSize,
          size: nodeSize,
          dragHandle: `.${genFlowNodeDragId(id)}`,
          style: {
            ...node.style,
            opacity: 1,
          },
          sourcePosition: POSITION_MAP[direction[1]],
          targetPosition: POSITION_MAP[direction[0]],
          layer,
          order,
        };
      }),
    [nodes, nodes.length]
  );

  const edgesWithDefaultInfo = useMemo<FlowEdge[]>(
    () =>
      map(edges, (edge) => ({
        ...edge,
        style: {
          ...edge.style,
          opacity: 1,
        },
      })),
    [edges, edges.length]
  );

  const layoutRender = useCallback(() => {
    if (!nodesWithDefaultInfo.length) {
      return;
    }
    const isHorizontal = direction === 'LR';
    const { nodes: dagreNodes, edges: dagreEgdes } = dagreGraph.layout({
      nodes: nodesWithDefaultInfo,
      edges: edgesWithDefaultInfo,
    });
    const nodesWithPostion = map(nodesWithDefaultInfo, (node) => {
      const tempNode = node;
      const nodeWithPosition = find(dagreNodes, ({ id }) => node.id === id);
      tempNode.targetPosition = isHorizontal ? Position.Left : Position.Top;
      tempNode.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      tempNode.position = nodeWithPosition
        ? getPosition(nodeWithPosition, direction)
        : tempNode.position;
      return tempNode;
    });

    console.log('dagreEgdes', dagreEgdes);

    setNodes(nodesWithPostion);
    setEdges(edgesWithDefaultInfo);
  }, [
    direction,
    nodesWithDefaultInfo,
    edgesWithDefaultInfo,
    nodesWithDefaultInfo.length,
    edgesWithDefaultInfo.length,
  ]);

  useEffect(() => {
    layoutRender();
  }, [layoutRender]);

  return layoutRender;
}

export { useAutoLayout };
