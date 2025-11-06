import http from '../utils/http';
import { extractData } from './helpers';

/**
 * 查询公开的文件资源。
 *
 * @param {{page?: number, size?: number, category?: string}} [params] 查询条件。
 * @returns {Promise<{list: Object[], page: number, size: number, total: number}>} 文件列表。
 */
export function listPublicFiles(params) {
  return http.get('/files', { params }).then(extractData);
}

/**
 * 获取公开文件的元信息。
 *
 * @param {number|string} id 文件 ID。
 * @returns {Promise<Object>} 文件信息。
 */
export function getPublicFile(id) {
  return http.get(`/files/${id}`).then(extractData);
}

/**
 * 上传后台文件资源。
 *
 * @param {{file: File|Blob, category?: string, extra?: Record<string, any>}} options 上传选项。
 * @returns {Promise<Object>} 上传成功后的文件信息。
 */
export function uploadAdminFile({ file, category, extra } = {}) {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  if (category) {
    formData.append('category', category);
  }
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
  }
  return http
    .post('/admin/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(extractData);
}

/**
 * 后台分页查询文件资源。
 *
 * @param {{page?: number, size?: number, category?: string}} [params] 查询条件。
 * @returns {Promise<{list: Object[], page: number, size: number, total: number}>} 文件列表。
 */
export function listAdminFiles(params) {
  return http.get('/admin/files', { params }).then(extractData);
}

/**
 * 获取后台文件详情。
 *
 * @param {number|string} id 文件 ID。
 * @returns {Promise<Object>} 文件详情。
 */
export function getAdminFile(id) {
  return http.get(`/admin/files/${id}`).then(extractData);
}

/**
 * 删除后台文件。
 *
 * @param {number|string} id 文件 ID。
 * @returns {Promise<void>} Promise 对象。
 */
export function deleteAdminFile(id) {
  return http.delete(`/admin/files/${id}`);
}
