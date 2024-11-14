import { deleteAnnouncement, getAnnouncementsList } from '@/services/nozomi/announcement';
import { WarningOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Popconfirm, message } from 'antd';
import React, { useRef } from 'react';
import * as Icons from '@ant-design/icons';
import CreateAnnouncement from './components/CreateAnnouncement';

function generateChronicleIcon(icon: string, color: string) {
  // @ts-ignore
  return React.createElement(Icons[icon], {
    twoToneColor: color,
  });
}

const AnnouncementManage = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const createDrawerRef = useRef<ActionType>();

  const removeAnnouncement = async (id: number) => {
    try {
      const res = await deleteAnnouncement({ id });
      if (res.code === 200) {
        message.success(intl.formatMessage({ id: 'pages.announcementManage.delete.success.tips' }));
      } else {
        message.error(res.msg);
      }
    } catch {
      message.error(intl.formatMessage({ id: 'pages.announcementManage.delete.error.tips' }));
    }
    actionRef.current?.reload();
  };

  const columns: ProColumns<API.AnnouncementData>[] = [
    {
      title: <FormattedMessage id="pages.announcementManage.id" />,
      dataIndex: 'id',
      width: 70,
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.announcementManage.content" />,
      dataIndex: 'content',
      width: '40%',
      valueType: 'textarea',
    },

    {
      title: <FormattedMessage id="pages.announcementManage.icon" />,
      dataIndex: 'icon',
      width: '7%',
      valueType: 'text',
      search: false,
      render: (_, entity) => {
        const icon = entity.icon;
        const color = entity.color;
        return generateChronicleIcon(icon, color);
      },
    },
    {
      title: <FormattedMessage id="pages.announcementManage.color" />,
      dataIndex: 'color',
      width: '7%',
      search: false,
      valueType: 'color',
    },
    {
      title: <FormattedMessage id="pages.announcementManage.announcementTime" />,
      dataIndex: 'announcement_time',
      width: '14%',
      valueType: 'date',
    },
    {
      title: <FormattedMessage id="common.option" />,
      dataIndex: 'option',
      valueType: 'option',
      width: '10%',
      render: (_, entity) => [
        <a
          key="update"
          onClick={() => {
            if (createDrawerRef.current) {
              // @ts-ignore 已经通过useImperativeHandle暴露了这个方法
              createDrawerRef.current.updateAnnouncement(true, entity.id);
            }
          }}
        >
          <FormattedMessage id="common.update" />
        </a>,
        <Popconfirm
          key="delete"
          title={intl.formatMessage({ id: 'common.warn' })}
          description={intl.formatMessage({ id: 'pages.announcementManage.confirm.delete' })}
          icon={<WarningOutlined style={{ color: 'red' }} />}
          onConfirm={() => removeAnnouncement(entity.id)}
          okText={intl.formatMessage({ id: 'common.confirm' })}
          cancelText={intl.formatMessage({ id: 'common.cancel' })}
        >
          <a>
            <FormattedMessage id="common.delete" />
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <PageContainer breadcrumbRender={false}>
        <ProTable<API.AnnouncementData>
          headerTitle={intl.formatMessage({
            id: 'pages.website.announcementManage.table.title',
          })}
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <CreateAnnouncement
              key="create"
              tableRef={actionRef}
              ref={createDrawerRef}
            ></CreateAnnouncement>,
          ]}
          request={async () => {
            const res = await getAnnouncementsList();
            return {
              success: true,
              data: res.data ?? [],
            };
          }}
          columns={columns}
        />
      </PageContainer>
    </>
  );
};

export default AnnouncementManage;
