import api from './api';
import type {
  CreateStudyRoomDto,
  StudyRoom,
  MyStudyRoom,
  StudyRoomSuccessResponse,
  GetAllStudyRoomsOptions,
} from '../types/studyroom.types';

class StudyRoomService {
  async createStudyRoom(data: CreateStudyRoomDto): Promise<StudyRoomSuccessResponse> {
    const response = await api.post('/studyrooms', data);
    return response.data;
  }

  async getAllStudyRooms(options: GetAllStudyRoomsOptions = {}) {
    const params = new URLSearchParams();

    if (options.roomType) params.append('roomType', options.roomType);
    if (options.search) params.append('search', options.search);
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());

    const response = await api.get(`/studyrooms?${params.toString()}`);
    return response.data;
  }

  async getMyStudyRooms(): Promise<MyStudyRoom[]> {
    const response = await api.get('/studyrooms/my-rooms');
    return response.data;
  }

  async getStudyRoom(roomId: number): Promise<StudyRoom & { myRole: string; inviteLink?: string }> {
    const response = await api.get(`/studyrooms/${roomId}`);
    return response.data;
  }

  async getStudyRoomByInviteCode(inviteCode: string): Promise<StudyRoom> {
    const response = await api.get(`/studyrooms/invite/${inviteCode}`);
    return response.data;
  }

  async joinByInviteCode(inviteCode: string): Promise<StudyRoom> {
    const response = await api.post(`/studyrooms/join/${inviteCode}`);
    return response.data;
  }

  async leaveStudyRoom(roomId: number): Promise<{ message: string }> {
    const response = await api.delete(`/studyrooms/${roomId}/leave`);
    return response.data;
  }

  async regenerateInviteLink(roomId: number): Promise<{ inviteCode: string; inviteLink: string }> {
    const response = await api.post(`/studyrooms/${roomId}/regenerate-invite`);
    return response.data;
  }
}

export default new StudyRoomService();
