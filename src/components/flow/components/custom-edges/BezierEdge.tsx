import type { FC, CSSProperties } from 'react';
import type { EdgeProps } from 'reactflow';

import { BaseEdge, getBezierPath } from 'reactflow';
import { useEventsFlowContext } from '../../stores';
import { isNumber } from 'lodash-es';
import { DEFAULT_EDGE_STYLE } from '../../constants';

const BezierEdge: FC<EdgeProps> = (props) => {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    markerStart,
    target,
  } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { draggingNodeChildrenIds } = useEventsFlowContext();

  const isEdgeInvisible = draggingNodeChildrenIds?.includes(target);

  const edgeOpacity = isEdgeInvisible ? 0 : isNumber(style.opacity) ? style.opacity : 'initial';

  const edgeStyle: CSSProperties = {
    ...DEFAULT_EDGE_STYLE,
    ...style,
    opacity: edgeOpacity,
  };

  if (!edgeOpacity) {
    return <></>;
  }

  return (
    <>
      <BaseEdge style={edgeStyle} path={edgePath} markerEnd={markerEnd} markerStart={markerStart} />
    </>
  );
};

export { BezierEdge };
