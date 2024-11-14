import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import CreateBlogPage from './components/CreateBlog';
import BlogTable, { OpenArticleType } from './components/BlogTable';
import { RollbackOutlined } from '@ant-design/icons';

const getCrumbLabel = (hash: string) => {
  const type = Number(hash.split('&')[1]);
  let label = 'pages.website.blogManage.create';
  switch (type) {
    case OpenArticleType.CREATE:
      label = 'pages.website.blogManage.create';
      break;
    case OpenArticleType.UPDATE:
      label = 'pages.website.blogManage.update';
      break;
    case OpenArticleType.VIEW:
      label = 'pages.website.blogManage.view';
      break;
    default:
      break;
  }
  return label;
};

const BlogManage = () => {
  const intl = useIntl();
  const [currentHash, setCurrentHash] = useState(window.location.hash);
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
      onClick: () => {
        window.location.hash = '';
      },
      className: styles['cursor-pointer'],
    },
    {
      title: intl.formatMessage({ id: getCrumbLabel(currentHash) }),
    },
  ];

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <PageContainer breadcrumbRender={false}>
      {currentHash !== '' ? (
        <>
          <div className={styles['back-breadcrumb-box']}>
            <RollbackOutlined
              className={styles['back-icon']}
              onClick={() => {
                window.location.hash = '';
              }}
            />
            <Breadcrumb items={breadCrumbItems} />
          </div>
          <CreateBlogPage hash={currentHash} />
        </>
      ) : (
        <>
          <BlogTable
            sendCreateStatus={() => (window.location.hash = `0&${OpenArticleType.CREATE}`)}
          />
        </>
      )}
    </PageContainer>
  );
};

export default BlogManage;
