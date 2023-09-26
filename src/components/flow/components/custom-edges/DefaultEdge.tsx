import type { FC, CSSProperties } from "react";
import type { EdgeProps } from "reactflow";

import { getSmoothStepPath, BaseEdge } from "reactflow";
import { useEventsFlowContext } from "../../stores";
import { isNumber } from "lodash";
import { DEFAULT_EDGE_STYLE } from "../../constants";

const DefaultEdge: FC<EdgeProps> = (props) => {
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

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  const { draggingNodeChildrenIds } = useEventsFlowContext();

  const isEdgeInvisible = draggingNodeChildrenIds?.includes(target);

  const edgeOpacity = isEdgeInvisible
    ? 0
    : isNumber(style.opacity)
    ? style.opacity
    : "initial";

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
      <BaseEdge
        style={edgeStyle}
        path={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
    </>
  );
};

export { DefaultEdge };
