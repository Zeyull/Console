// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取公告 GET /nozomi/announcement */
export async function getAnnouncement(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAnnouncementParams,
  options?: { [key: string]: any },
) {
  return request<API.GetAnnouncementResponse>('/nozomi/announcement', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改公告 PUT /nozomi/announcement */
export async function updateAnnouncement(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateAnnouncementParams,
  body: API.UpdateAnnouncementData,
  options?: { [key: string]: any },
) {
  return request<API.UpdateAnnouncementResponse>('/nozomi/announcement', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增公告 POST /nozomi/announcement */
export async function addAnnouncement(
  body: API.AddAnnouncementData,
  options?: { [key: string]: any },
) {
  return request<API.AddAnnouncementResponse>('/nozomi/announcement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除公告 DELETE /nozomi/announcement */
export async function deleteAnnouncement(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAnnouncementParams,
  options?: { [key: string]: any },
) {
  return request<API.DeleteAnnouncementResponse>('/nozomi/announcement', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取公告列表 GET /nozomi/announcements-list */
export async function getAnnouncementsList(options?: { [key: string]: any }) {
  return request<API.AnnouncementListResponse>('/nozomi/announcements-list', {
    method: 'GET',
    ...(options || {}),
  });
}
