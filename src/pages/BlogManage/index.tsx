import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Breadcrumb } from 'antd';
import { useState } from 'react';
import styles from './index.less';
import CreateBlogPage from './components/CreateBlog';
import BlogTable from './components/BlogTable';

const BlogManage = () => {
  const intl = useIntl();
  const [isCreate, setIsCreate] = useState(false);

  const breadCrumbItems = [
    {
      title: intl.formatMessage({
        id: 'menu.website',
      }),
    },
    {
      title: intl.formatMessage({
        id: 'menu.website.blog-manage',
      }),
      onClick: () => setIsCreate(false),
      className: styles['cursor-pointer'],
    },
    {
      title: intl.formatMessage({ id: 'pages.website.blog-manage.create' }),
    },
  ];

  return (
    <PageContainer breadcrumbRender={false}>
      {isCreate ? (
        <>
          <Breadcrumb items={breadCrumbItems} />
          <CreateBlogPage />
        </>
      ) : (
        <>
          <BlogTable sendCreateStatus={() => setIsCreate(true)} />
        </>
      )}
    </PageContainer>
  );
};

export default BlogManage;
