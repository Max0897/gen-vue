import http from '../utils/http';
import { extractData } from './helpers';

/**
 * 调用系统健康检查接口。
 *
 * @returns {Promise<{status: string, env: string}>} 健康信息。
 */
export function checkHealth() {
  return http.get('/health').then(extractData);
}
