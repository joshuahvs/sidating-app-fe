import axios from 'axios';
import type {
  Reply,
  CreateReplyRequest,
  UpdateReplyRequest,
  ReplyResponse
} from '@/interfaces/reply.interface';
import { getAuthToken } from '@/lib/auth';
 
const API_URL = import.meta.env.VITE_BE2_API_URL || 'http://localhost:8081/api';
 
const getHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: token ? `Bearer ${token}` : ''
  };
};
 
export const replyService = {
  async getAllReplies(): Promise<Reply[]> {
    const response = await axios.get<ReplyResponse>(`${API_URL}/replies`, {
      headers: getHeaders()
    });
    return Array.isArray(response.data.data) ? response.data.data : [];
  },
 
  async getRepliesByPostId(postId: string): Promise<Reply[]> {
    const response = await axios.get<ReplyResponse>(`${API_URL}/replies`, {
      params: { postId },
      headers: getHeaders()
    });
    return Array.isArray(response.data.data) ? response.data.data : [];
  },
 
  async getReplyById(id: string): Promise<Reply> {
    const response = await axios.get<ReplyResponse>(`${API_URL}/replies/${id}`, {
      headers: getHeaders()
    });
    return response.data.data as Reply;
  },
 
  async createReply(request: CreateReplyRequest): Promise<Reply> {
    const response = await axios.post<ReplyResponse>(`${API_URL}/replies/create`, request, {
      headers: getHeaders()
    });
    return response.data.data as Reply;
  },

  async updateReply(id: string, request: UpdateReplyRequest): Promise<Reply> {
    const response = await axios.put<ReplyResponse>(`${API_URL}/replies/${id}`, request, {
      headers: getHeaders()
    });
    return response.data.data as Reply;
  },

  async deleteReply(id: string): Promise<void> {
    await axios.delete(`${API_URL}/replies/${id}`, {
      headers: getHeaders()
    });
  },
};