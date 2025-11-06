import http from '../utils/http';
import { extractData } from './helpers';

/**
 * 获取全部角色列表。
 *
 * @returns {Promise<Object[]>} 角色数组。
 */
export function listRoles() {
  return http.get('/admin/roles').then(extractData);
}

/**
 * 创建角色。
 *
 * @param {{name: string, code: string, description?: string}} payload 角色信息。
 * @returns {Promise<Object>} 新创建的角色。
 */
export function createRole(payload) {
  return http.post('/admin/roles', payload).then(extractData);
}

/**
 * 更新角色。
 *
 * @param {number|string} id 角色 ID。
 * @param {{name: string, code: string, description?: string}} payload 角色信息。
 * @returns {Promise<Object>} 更新后的角色。
 */
export function updateRole(id, payload) {
  return http.put(`/admin/roles/${id}`, payload).then(extractData);
}

/**
 * 删除角色。
 *
 * @param {number|string} id 角色 ID。
 * @returns {Promise<void>} Promise 对象。
 */
export function deleteRole(id) {
  return http.delete(`/admin/roles/${id}`);
}

/**
 * 获取角色的权限列表。
 *
 * @param {number|string} id 角色 ID。
 * @returns {Promise<Object[]>} 权限数组。
 */
export function listRolePermissions(id) {
  return http.get(`/admin/roles/${id}/permissions`).then(extractData);
}

/**
 * 更新角色的权限。
 *
 * @param {number|string} id 角色 ID。
 * @param {{permission_ids: number[]}} payload 权限 ID 列表。
 * @returns {Promise<void>} Promise 对象。
 */
export function assignRolePermissions(id, payload) {
  return http.put(`/admin/roles/${id}/permissions`, payload);
}

/**
 * 获取全部权限列表。
 *
 * @returns {Promise<Object[]>} 权限数组。
 */
export function listPermissions() {
  return http.get('/admin/permissions').then(extractData);
}

/**
 * 创建权限。
 *
 * @param {{name: string, code: string, category?: string, description?: string}} payload 权限信息。
 * @returns {Promise<Object>} 新创建的权限。
 */
export function createPermission(payload) {
  return http.post('/admin/permissions', payload).then(extractData);
}

/**
 * 更新权限。
 *
 * @param {number|string} id 权限 ID。
 * @param {{name: string, code: string, category?: string, description?: string}} payload 权限信息。
 * @returns {Promise<Object>} 更新后的权限。
 */
export function updatePermission(id, payload) {
  return http.put(`/admin/permissions/${id}`, payload).then(extractData);
}

/**
 * 删除权限。
 *
 * @param {number|string} id 权限 ID。
 * @returns {Promise<void>} Promise 对象。
 */
export function deletePermission(id) {
  return http.delete(`/admin/permissions/${id}`);
}

/**
 * 查询用户拥有的角色。
 *
 * @param {number|string} userId 用户 ID。
 * @returns {Promise<Object[]>} 角色数组。
 */
export function listUserRoles(userId) {
  return http.get(`/admin/users/${userId}/roles`).then(extractData);
}

/**
 * 给用户绑定角色。
 *
 * @param {number|string} userId 用户 ID。
 * @param {{role_id: number}} payload 绑定参数。
 * @returns {Promise<void>} Promise 对象。
 */
export function attachUserRole(userId, payload) {
  return http.post(`/admin/users/${userId}/roles`, payload);
}

/**
 * 移除用户的角色。
 *
 * @param {number|string} userId 用户 ID。
 * @param {number|string} roleId 角色 ID。
 * @returns {Promise<void>} Promise 对象。
 */
export function detachUserRole(userId, roleId) {
  return http.delete(`/admin/users/${userId}/roles/${roleId}`);
}
