import http from '../utils/http';
import { extractData } from './helpers';

/**
 * 获取当前登录用户信息。
 *
 * @returns {Promise<Object>} 用户档案信息。
 */
export function getProfile() {
  return http.get('/user/profile').then(extractData);
}

/**
 * 更新当前用户的资料。
 *
 * @param {{nickname?: string, avatar_url?: string}} payload 要更新的字段。
 * @returns {Promise<Object>} 更新后的用户档案。
 */
export function updateProfile(payload) {
  return http.put('/user/profile', payload).then(extractData);
}

/**
 * 获取后台用户列表。
 *
 * @param {{page?: number, size?: number, keyword?: string}} params 查询参数。
 * @returns {Promise<{list: Object[], page: number, size: number, total: number}>} 用户分页数据。
 */
export function listAdminUsers(params) {
  return http
    .get('/admin/users', { params })
    .then(extractData);
}
