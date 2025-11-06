import http from '../utils/http';
import { extractData } from './helpers';

/**
 * 获取客户端可用的分类树。
 *
 * @returns {Promise<Object[]>} 启用状态下的分类树。
 */
export function listPublicCategories() {
  return http.get('/categories').then(extractData);
}

/**
 * 后台分页查询分类列表。
 *
 * @param {{page?: number, size?: number, status?: number, parent_id?: number}} [params] 查询参数。
 * @returns {Promise<{list: Object[], page: number, size: number, total: number}>} 列表数据。
 */
export function listAdminCategories(params) {
  return http
    .get('/admin/categories', { params })
    .then(extractData);
}

/**
 * 获取指定分类详情（后台）。
 *
 * @param {number|string} id 分类 ID。
 * @returns {Promise<Object>} 分类详情。
 */
export function getAdminCategory(id) {
  return http.get(`/admin/categories/${id}`).then(extractData);
}

/**
 * 创建分类（后台）。
 *
 * @param {Object} payload 分类数据。
 * @returns {Promise<Object>} 新建的分类。
 */
export function createAdminCategory(payload) {
  return http.post('/admin/categories', payload).then(extractData);
}

/**
 * 更新分类（后台）。
 *
 * @param {number|string} id 分类 ID。
 * @param {Object} payload 分类数据。
 * @returns {Promise<Object>} 更新后的分类。
 */
export function updateAdminCategory(id, payload) {
  return http.put(`/admin/categories/${id}`, payload).then(extractData);
}

/**
 * 删除分类（后台）。
 *
 * @param {number|string} id 分类 ID。
 * @returns {Promise<void>} Promise 对象。
 */
export function deleteAdminCategory(id) {
  return http.delete(`/admin/categories/${id}`);
}
