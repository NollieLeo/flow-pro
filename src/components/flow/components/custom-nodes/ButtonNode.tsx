import { CustomNodeWrapper } from '../../components/CustomNodeWrapper';
import styles from './ButtonNode.module.scss';
import { FlowNodeComponentProps } from '../../types/nodes';

const ButtonNode = (props: FlowNodeComponentProps) => {
  return (
    <CustomNodeWrapper className={styles.customButtonNodeWrapper} {...props}>
      <div data-comp-type="ButtonNode" />
    </CustomNodeWrapper>
  );
};

export { ButtonNode };
