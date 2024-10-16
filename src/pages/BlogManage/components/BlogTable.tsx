import { Button } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { getArticleList } from '@/services/nozomi/article';

const BlogTable = (props: { sendCreateStatus: any }) => {
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();

  const intl = useIntl();

  const columns: ProColumns<API.ArticleData>[] = [
    {
      title: <FormattedMessage id="pages.blogTable.id" />,
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.blogTable.title" />,
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.blogTable.content" />,
      dataIndex: 'content',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.blogTable.createdAt" />,
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.blogTable.updateAt" />,
      dataIndex: 'updated_at',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" />,
      dataIndex: 'option',
      valueType: 'option',
      render: () => [
        <a key="view" href="https://procomponents.ant.design/">
          <FormattedMessage id="pages.blogTable.titleOption.view" />
        </a>,
        <a key="update" href="https://procomponents.ant.design/">
          <FormattedMessage id="pages.blogTable.titleOption.update" />
        </a>,
        <a key="delete" href="https://procomponents.ant.design/">
          <FormattedMessage id="pages.blogTable.titleOption.delete" />
        </a>,
      ],
    },
  ];

  return (
    <div>
      <ProTable<API.ArticleData>
        headerTitle={intl.formatMessage({
          id: 'pages.website.blog-manage.table.title',
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
            <PlusOutlined /> <FormattedMessage id="pages.website.blog-manage.create" />
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
