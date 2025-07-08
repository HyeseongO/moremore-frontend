export type RoomType = 'SMALL' | 'LARGE';
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface User {
  id: number;
  nickname: string;
  email?: string;
  profileImage?: string;
}

export interface CreateStudyRoomDto {
  title: string;
  roomType: RoomType;
  description?: string;
}

export interface StudyRoom {
  id: number;
  title: string;
  description?: string;
  roomType: RoomType;
  maxMembers: number;
  inviteCode: string;
  inviteLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  owner: User;
  members?: StudyRoomMember[];
  _count?: {
    members: number;
  };
}

export interface GetAllStudyRoomsOptions {
  roomType?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface StudyRoomMember {
  id: number;
  role: MemberRole;
  joinedAt: string;
  userId: number;
  roomId: number;
  user: User;
}

export interface MyStudyRoom extends StudyRoom {
  myRole: MemberRole;
  joinedAt: string;
}

export interface StudyRoomSuccessResponse extends StudyRoom {
  inviteLink: string;
}
