import http from '../utils/http';
import { extractData } from './helpers';

/**
 * 创建扫码登录二维码。
 *
 * @returns {Promise<{scene_id: string, qr_content: string, polling_token: string, expires_in: number}>}
 */
export function createLoginQRCode() {
  return http.post('/admin/login/qrcode').then(extractData);
}

/**
 * 查询扫码登录状态。
 *
 * @param {string} sceneId 会话 ID。
 * @param {string} pollingToken 轮询令牌，创建二维码时返回。
 * @returns {Promise<{scene_id: string, status: string, expires_in: number, scanned_user?: Object, token?: string, refresh_token?: string}>}
 */
export function getLoginStatus(sceneId, pollingToken) {
  return http
    .get(`/admin/login/qrcode/${sceneId}`, { params: { polling_token: pollingToken } })
    .then(extractData);
}
