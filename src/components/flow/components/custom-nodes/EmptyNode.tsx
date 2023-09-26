import { CustomNodeWrapper } from '../CustomNodeWrapper';
import styles from './EmptyNode.module.scss';
import { FlowNodeComponentProps } from '../../types/nodes';

const EmptyNode = (props: FlowNodeComponentProps) => {
  return (
    <CustomNodeWrapper className={styles.customEmptyNodeWrapper} {...props}>
      <div className={styles.customEmptyNode} data-comp-type="EmptyNode" />
    </CustomNodeWrapper>
  );
};

export { EmptyNode };
