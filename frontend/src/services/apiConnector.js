/**
 * @file apiConnector.js
 * @description Axios HTTP client wrapper for the StudyX frontend
 * @module services/apiConnector
 * 
 * Provides a centralized API connector using Axios for making HTTP requests.
 * Supports all HTTP methods with configurable body data, headers, and params.
 * Used by all API operation files for consistent request handling.
 */

import axios from "axios"

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
}