// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取文章 GET /nozomi/article */
export async function getArticle(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getArticleParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ArticleResponse>('/nozomi/article', {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新文章 PUT /nozomi/article */
export async function updateArticle(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateArticleParams,
  body: API.UpdateArticleData,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.UpdateArticleResponse>('/nozomi/article', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 新增文章 POST /nozomi/article */
export async function addArticle(body: API.AddArticleData, options?: { [key: string]: any }) {
  return request<API.AddArticleResponse>('/nozomi/article', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取文章列表 GET /nozomi/articles-list */
export async function getArticleList(options?: { [key: string]: any }) {
  return request<API.ArticleListResponse>('/nozomi/articles-list', {
    method: 'GET',
    ...(options || {}),
  });
}
