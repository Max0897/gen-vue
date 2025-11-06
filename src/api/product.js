import http from '../utils/http';
import { extractData } from './helpers';

/**
 * 客户端查询商品列表（仅上架商品）。
 *
 * @param {{page?: number, size?: number, keyword?: string, category_id?: number}} [params] 查询条件。
 * @returns {Promise<{list: Object[], page: number, size: number, total: number}>} 商品分页数据。
 */
export function listPublicProducts(params) {
  return http
    .get('/products', { params })
    .then(extractData);
}

/**
 * 后台查询商品列表。
 *
 * @param {{page?: number, size?: number, keyword?: string, category_id?: number, status?: number}} [params] 查询条件。
 * @returns {Promise<{list: Object[], page: number, size: number, total: number}>} 商品分页数据。
 */
export function listAdminProducts(params) {
  return http
    .get('/admin/products', { params })
    .then(extractData);
}

/**
 * 获取商品详情。
 *
 * @param {number|string} id 商品 ID。
 * @returns {Promise<Object>} 商品信息。
 */
export function getProduct(id) {
  return http.get(`/products/${id}`).then(extractData);
}

/**
 * 创建商品（后台）。
 *
 * @param {Object} payload 商品表单数据。
 * @returns {Promise<Object>} 新建的商品。
 */
export function createProduct(payload) {
  return http.post('/admin/products', payload).then(extractData);
}

/**
 * 更新商品信息（后台）。
 *
 * @param {number|string} id 商品 ID。
 * @param {Object} payload 商品表单数据。
 * @returns {Promise<Object>} 更新后的商品。
 */
export function updateProduct(id, payload) {
  return http.put(`/admin/products/${id}`, payload).then(extractData);
}

/**
 * 删除商品（后台）。
 *
 * @param {number|string} id 商品 ID。
 * @returns {Promise<void>} Promise 对象。
 */
export function deleteProduct(id) {
  return http.delete(`/admin/products/${id}`);
}

/**
 * 更新商品状态（后台）。
 *
 * @param {number|string} id 商品 ID。
 * @param {{status: number}} payload 状态数据（0=下架, 1=上架）。
 * @returns {Promise<Object>} 更新后的商品。
 */
export function updateProductStatus(id, payload) {
  return http.put(`/admin/products/${id}/status`, payload).then(extractData);
}

/**
 * 调整商品库存（后台）。
 *
 * @param {number|string} id 商品 ID。
 * @param {{change: number, type: number, ref?: string, operator_id?: number}} payload 库存调整参数。
 * @returns {Promise<Object>} 调整后的商品。
 */
export function adjustProductInventory(id, payload) {
  return http.post(`/admin/products/${id}/inventory`, payload).then(extractData);
}

/**
 * 查询商品库存变动记录（后台）。
 *
 * @param {number|string} id 商品 ID。
 * @param {{page?: number, size?: number}} [params] 分页参数。
 * @returns {Promise<{list: Object[], page: number, size: number, total: number}>} 库存变动记录。
 */
export function listProductInventoryLogs(id, params) {
  return http
    .get(`/admin/products/${id}/inventory/logs`, { params })
    .then(extractData);
}
