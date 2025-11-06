/**
 * Return `response.data` if present, otherwise fall back to the original payload.
 *
 * @param {*} response Raw axios response payload processed by the interceptor.
 * @returns {*} Extracted business data.
 */
export function extractData(response) {
  if (response && typeof response === 'object' && Object.prototype.hasOwnProperty.call(response, 'data')) {
    return response.data;
  }
  return response;
}
