import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Card } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <FormattedMessage id="pages.welcome.description" />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
