import styles from './GroupNode.module.scss';
import { CustomNodeWrapper } from '../CustomNodeWrapper';
import { useEventsFlowContext } from '../../stores';
import classNames from 'classnames';
import { FlowNodeComponentProps } from '../../types/nodes';

function GroupNode(props: FlowNodeComponentProps) {
  const {
    id,
    data: { label },
  } = props;

  const { selectedNodeId } = useEventsFlowContext();

  const groupNodeCls = classNames(styles.customGroupNode, {
    [styles.isSelected]: selectedNodeId === id,
  });

  return (
    <CustomNodeWrapper {...props}>
      <div className={groupNodeCls} data-comp-type="GroupNode">
        <header className={styles.customGroupNodeHeader}>
          <span>{label}</span>
        </header>
      </div>
    </CustomNodeWrapper>
  );
}

export { GroupNode };
