import http from '../utils/http';
import { extractData } from './helpers';

/**
 * 获取当前用户的全部收货地址列表。
 *
 * @returns {Promise<Object[]>} 收货地址数组。
 */
export function listAddresses() {
  return http.get('/addresses').then(extractData);
}

/**
 * 新增收货地址。
 *
 * @param {Object} payload 地址表单数据。
 * @returns {Promise<Object>} 新创建的地址。
 */
export function createAddress(payload) {
  return http.post('/addresses', payload).then(extractData);
}

/**
 * 更新指定的收货地址。
 *
 * @param {number|string} id 地址 ID。
 * @param {Object} payload 地址表单数据。
 * @returns {Promise<Object>} 更新后的地址。
 */
export function updateAddress(id, payload) {
  return http.put(`/addresses/${id}`, payload).then(extractData);
}

/**
 * 删除收货地址。
 *
 * @param {number|string} id 地址 ID。
 * @returns {Promise<void>} Promise 对象。
 */
export function deleteAddress(id) {
  return http.delete(`/addresses/${id}`);
}

/**
 * 设置默认收货地址。
 *
 * @param {number|string} id 地址 ID。
 * @returns {Promise<void>} Promise 对象。
 */
export function setDefaultAddress(id) {
  return http.post(`/addresses/${id}/default`);
}
