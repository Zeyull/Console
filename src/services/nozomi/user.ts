// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 用户登录 POST /nozomi/login */
export async function loginUser(body: API.UserLogin, options?: { [key: string]: any }) {
  return request<API.LoginResponse>('/nozomi/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户注册 POST /nozomi/register */
export async function registerUser(body: API.UserRegister, options?: { [key: string]: any }) {
  return request<API.RegisterResponse>('/nozomi/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 验证Token有效性 POST /nozomi/verify-token */
export async function verifyToken(body: API.UserToken, options?: { [key: string]: any }) {
  return request<API.VerifyTokenResponse>('/nozomi/verify-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
