import { Button, message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { deleteArticle, getArticleList } from '@/services/nozomi/article';
import { createStyles } from 'antd-style';

export enum OpenArticleType {
  VIEW,
  UPDATE,
  CREATE,
}

const useStyles = createStyles(() => {
  return {
    content: {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: '2',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: '1.5',
      maxHeight: '4.5em',
    },
  };
});

const BlogTable = (props: { sendCreateStatus: any }) => {
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const { styles } = useStyles();
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const viewBlog = (id: number) => {
    window.location.hash = `${id}&${OpenArticleType.VIEW}`;
  };

  const updateBlog = (id: number) => {
    window.location.hash = `${id}&${OpenArticleType.UPDATE}`;
  };

  const deleteBlog = async (id: number) => {
    try {
      const res = await deleteArticle({ id });
      if (res.code === 200) {
        message.success(intl.formatMessage({ id: 'pages.blogTable.delete.success.tips' }));
      } else {
        message.error(res.msg);
      }
    } catch {
      message.error(intl.formatMessage({ id: 'pages.blogTable.delete.error.tips' }));
    }
    actionRef.current?.reload();
  };

  const columns: ProColumns<API.ArticleData>[] = [
    {
      title: <FormattedMessage id="pages.blogTable.id" />,
      dataIndex: 'id',
      width: 70,
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.blogTable.title" />,
      dataIndex: 'title',
      valueType: 'text',
      width: '20%',
      render: (_, entity) => {
        const title = entity.title;
        return <span className={styles.content}>{title}</span>;
      },
    },
    {
      title: <FormattedMessage id="pages.blogTable.content" />,
      dataIndex: 'content',
      width: '50%',
      valueType: 'textarea',
      render: (_, entity) => {
        const content = entity.content;
        return <span className={styles.content}>{content}</span>;
      },
    },
    {
      title: <FormattedMessage id="pages.blogTable.createdAt" />,
      dataIndex: 'created_at',
      width: '7%',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.blogTable.updateAt" />,
      dataIndex: 'updated_at',
      width: '7%',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" />,
      dataIndex: 'option',
      valueType: 'option',
      width: '10%',
      render: (_, entity) => [
        <a key="view" onClick={() => viewBlog(entity.id)}>
          <FormattedMessage id="pages.blogTable.titleOption.view" />
        </a>,
        <a key="update" onClick={() => updateBlog(entity.id)}>
          <FormattedMessage id="pages.blogTable.titleOption.update" />
        </a>,
        <a key="delete" onClick={() => deleteBlog(entity.id)}>
          <FormattedMessage id="pages.blogTable.titleOption.delete" />
        </a>,
      ],
    },
  ];

  return (
    <div>
      <ProTable<API.ArticleData>
        headerTitle={intl.formatMessage({
          id: 'pages.website.blogManage.table.title',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              props.sendCreateStatus();
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.website.blogManage.create" />
          </Button>,
        ]}
        request={
          // @ts-ignore
          async () => {
            const res = await getArticleList();
            return {
              success: true,
              data: res?.data?.data ?? undefined,
            };
          }
        }
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
            console.log(selectedRowsState);
          },
        }}
      />
    </div>
  );
};

export default BlogTable;
