import http from '../utils/http';
import { extractData } from './helpers';

/**
 * Exchange WeChat mini-program login code for tokens.
 *
 * @param {string} code wx.login 返回的 code.
 * @returns {Promise<Object>} 登录结果（包含 token、refresh_token、用户信息等）。
 */
export function loginWithWechat(code) {
  return http
    .post('/auth/wechat/login', { code })
    .then(extractData);
}

/**
 * 使用 refresh_token 刷新访问凭证。
 *
 * @param {string} refreshToken 之前登录返回的 refresh_token。
 * @returns {Promise<Object>} 刷新后的 token 数据。
 */
export function refreshTokens(refreshToken) {
  return http
    .post('/auth/refresh', { refresh_token: refreshToken })
    .then(extractData);
}

/**
 * 绑定用户手机号。
 *
 * @param {{code?: string, encryptedData?: string, iv?: string}} payload 绑定参数。
 * @returns {Promise<Object>} 更新后的用户信息。
 */
export function bindPhone(payload) {
  return http
    .post('/user/phone/bind', payload)
    .then(extractData);
}

/**
 * 退出登录并注销 token。
 *
 * @param {{refresh_token?: string}} [payload] 可选的 refresh_token，用于主动失效刷新令牌。
 * @returns {Promise<void>} Promise 对象。
 */
export function logout(payload) {
  return http.post('/auth/logout', payload);
}
