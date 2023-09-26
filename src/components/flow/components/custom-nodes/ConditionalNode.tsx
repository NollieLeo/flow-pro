import styles from './ConditionalNode.module.scss';
import { CustomNodeWrapper } from '../CustomNodeWrapper';
import { useEventsFlowContext } from '../../stores';
import classNames from 'classnames';
import { FlowNodeComponentProps } from '../../types/nodes';

function ConditionalNode(props: FlowNodeComponentProps) {
  const {
    id,
    data: { label },
  } = props;

  const { selectedNodeId } = useEventsFlowContext();
  const groupNodeCls = classNames(styles.conditionalNode, {
    [styles.isSelected]: selectedNodeId === id,
  });

  return (
    <CustomNodeWrapper {...props}>
      <div className={groupNodeCls} data-comp-type="ConditionalNode">
        <header className={styles.conditionalNodeHeader}>
          <span>{label}</span>
        </header>
      </div>
    </CustomNodeWrapper>
  );
}

export { ConditionalNode };
