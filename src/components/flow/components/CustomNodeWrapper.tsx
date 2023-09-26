import { CSSProperties, memo, FC, ReactNode, useMemo, MouseEventHandler } from 'react';
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow';
import classnames from 'classnames';
import { map, pick } from 'lodash';
import { ActionAddonBtn } from './ActionAddonBtn';
import styles from './CustomNodeWrapper.module.scss';
import { useEventsFlowContext } from '../stores';
import { FlowNodeComponentProps, FlowNodeData, FlowNodeType } from '../types/nodes';
import { genFlowNodeDragId } from '../utils';
import { HIDDEN_ADDON_BTN_NODE_TYEPS, NODE_SIZE_MAP } from '../constants';

interface CustomWrapper extends FlowNodeComponentProps<FlowNodeData> {
  className?: string;
  children?: ReactNode;
  id: NodeProps['id'];
  handles?: Position[];
}

const DEFAULT_HANDlE = [Position.Top, Position.Bottom];

const CustomNodeWrapper: FC<CustomWrapper> = memo((props) => {
  const {
    children,
    className,
    id,
    handles = DEFAULT_HANDlE,
    type: nodeType,
    selected,
    dragging,
    xPos,
    yPos,
  } = props;

  const {
    onNodeSelect,
    setSelectedNodeId,
    customNodeAddButton,
    customNodeOperationButton,
    selectedNodeId,
    draggingNode,
    draggingNodeChildrenIds,
    draggingNodeSiblingIds,
  } = useEventsFlowContext();

  const isDragging = dragging && draggingNode?.id === id;

  const { getNode } = useReactFlow();

  const currentNode = useMemo(() => getNode(id), [id]);

  const isMetDraggingNodeChild = useMemo(
    () => draggingNodeChildrenIds.length && draggingNodeChildrenIds?.includes(id),
    [id, draggingNodeChildrenIds]
  );

  const isMetDraggingOver = !!draggingNode && draggingNode?.id !== id;

  const isMetDraggingNodeSibling = useMemo(
    () => draggingNodeSiblingIds.length && draggingNodeSiblingIds.includes(id),
    [id, draggingNodeSiblingIds]
  );

  const childNodesNum = draggingNodeChildrenIds?.length || 0;

  const isNodeInvisible = !isDragging && isMetDraggingNodeChild;

  const customNodeWrapperCls = classnames(styles.customNodeWrapper, className, {
    [`${styles.isNodeDragging}`]: isDragging,
    [`${styles.isDraggingOver}`]: isMetDraggingOver,
  });

  if (!currentNode) {
    return <></>;
  }

  const { style: nodeStyle } = currentNode;

  const nodeSize =
    nodeStyle?.width && nodeStyle.height
      ? pick(nodeStyle, ['height', 'width'])
      : NODE_SIZE_MAP[nodeType];

  const nodeWrapperStyle = {
    ...nodeStyle,
    ...nodeSize,
    opacity: isNodeInvisible ? 0 : nodeStyle?.opacity,
  };

  const addonBtn = (
    <ActionAddonBtn
      className={classnames(styles.addonBtn, {
        [styles.addonBtnVisible]:
          nodeType === FlowNodeType.EMPTY || selectedNodeId === id || selected,
      })}
    />
  );

  const renderDraggingOverShadow = () => {
    if (!isMetDraggingNodeSibling) {
      return <></>;
    }
    return <div className={styles.draggingOverShadow} />;
  };

  const renderNodeAddButton = () => {
    const node = getNode(id);
    if (!node || (node.type && HIDDEN_ADDON_BTN_NODE_TYEPS.includes(node.type))) {
      return <></>;
    }
    let addBtnContent: ReactNode = addonBtn;
    if (customNodeAddButton) {
      addBtnContent = customNodeAddButton(node, addonBtn);
    }
    if (!addBtnContent) {
      return <></>;
    }
    return (
      <div
        className={classnames(styles.addonBtnWrapper, {
          [styles.addonBtnWrapperWithoutEdge]: node.type === FlowNodeType.BUTTON,
        })}
      >
        {addBtnContent}
      </div>
    );
  };

  const renderNodeOperationBtn = () => {
    const node = getNode(id);
    if (isNodeInvisible || !node || node.type === FlowNodeType.BUTTON) {
      return <></>;
    }
    if (customNodeOperationButton && node) {
      return <div className={styles.nodeOperation}>{customNodeOperationButton(node)}</div>;
    }
    return <></>;
  };

  const renderNodeHandler = () => {
    return map(handles, (value) => {
      const type = [Position.Bottom, Position.Right, Position.Left].includes(value)
        ? 'source'
        : 'target';
      const cls = classnames(styles.customHandle, [styles[value]], [styles.hidden]);
      return (
        <Handle
          draggable={false}
          key={value}
          type={type}
          className={cls}
          position={value}
          isConnectable={false}
          id={value}
        />
      );
    });
  };

  const handleNodeClick: MouseEventHandler<HTMLDivElement> = () => {
    const node = getNode(id);
    if (node?.selectable) {
      if (setSelectedNodeId) {
        setSelectedNodeId(id);
      }
      if (onNodeSelect && node) {
        onNodeSelect(node);
      }
    }
  };

  const renderDraggingClonedNode = () => {
    if (!isDragging) {
      return <></>;
    }
    const { position: draggingNodePosition, height, width } = draggingNode;
    const translateXPos = `${draggingNodePosition.x - xPos}px`;
    const translateYPos = `${draggingNodePosition.y - yPos}px`;
    const draggingStyle: CSSProperties = {
      transform: `translate(${translateXPos}, ${translateYPos})`,
    };
    const wrapperStyle = height && width ? { height, width } : {};
    return (
      <div className={styles.draggingClonedNode} style={draggingStyle}>
        <div
          className={classnames({
            [styles.draggingClonedNodeWrapper]: currentNode.type === FlowNodeType.PROCESS,
          })}
          style={wrapperStyle}
        >
          {children}
        </div>
        {childNodesNum ? (
          <>
            <div className={styles.draggingClonedNodeDivider} />
            <div className={styles.draggingNodeChildNum}>{childNodesNum}</div>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={customNodeWrapperCls}
        data-comp-type="CustomNodeWrapper"
        style={nodeWrapperStyle}
      >
        <div
          className={classnames(genFlowNodeDragId(id), styles.wrapperContent)}
          onClick={handleNodeClick}
        >
          {children}
          {children && renderNodeHandler()}
        </div>
        {renderDraggingOverShadow()}
      </div>
      {renderDraggingClonedNode()}
      {renderNodeOperationBtn()}
      {renderNodeAddButton()}
    </>
  );
});
export { CustomNodeWrapper };
