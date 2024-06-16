import React from 'react';
import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';
import styles from './index.module.css';
import { close } from '@/assets/images';
import Image from 'next/image';
import useResponsive from '@/hooks/useResponsive';
export interface ModalProps extends AntdModalProps {
  subTitle?: string;
  width?: number;
  disableMobileLayout?: boolean;
}
function CommonModal(props: ModalProps) {
  const { children, className, title, subTitle, wrapClassName, width = 440, disableMobileLayout = false } = props;

  const { isLG } = useResponsive();

  return (
    <AntdModal
      keyboard={false}
      maskClosable={false}
      destroyOnClose={true}
      closeIcon={<Image src={close} width={24} height={24} alt='close' />}
      width={width}
      footer={null}
      centered
      {...props}
      className={`${styles.modal} ${isLG && styles['modal-mobile']} ${
        isLG && !disableMobileLayout && styles['modal-full-screen']
      } ${className || ''}`}
      wrapClassName={`${styles['modal-wrap']} ${wrapClassName}`}
      title={
        <div>
          <div className="pr-8 break-words">{title}</div>
        </div>
      }>
      {children}
    </AntdModal>
  );
}

export default React.memo(CommonModal);
