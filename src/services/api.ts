import axios from 'axios';
import { ProductResponse } from '../types';

const axiosInstance = axios.create({
  baseURL: '/api', // ✅ Works on same domain in Render
});

// Track a new product by URL
export const trackProduct = async (url: string): Promise<ProductResponse> => {
  const response = await axiosInstance.post('/products', { url });
  return response.data;
};

// Get a single product by ID
export const getProductData = async (productId: string): Promise<ProductResponse> => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
};

// Get all tracked products
export const getAllProducts = async (): Promise<ProductResponse[]> => {
  const response = await axiosInstance.get('/products');
  return response.data;
};
