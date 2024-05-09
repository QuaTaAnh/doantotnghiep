export interface IUser {
  id: number;
  name: string;
  password: string;
  phone: string;
  zalo: string;
  avatar: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileForm extends IUser {
  newPassword: string;
  oldPassword: string;
}

export interface IUserProps {
  user: IUser;
  token: string;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface IImage {
  postId?: number;
  imageUrl: string;
}

export interface ICategory {
  id: number;
  code: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPost {
  id: number;
  user: IUser;
  title: string;
  shortDescription: string;
  detail: string;
  address: string;
  status: string;
  target: string;
  priceNumber: number;
  areaNumber: number;
  categoryId: number;
  userId: number;
  priceId: number;
  areaId: number;
  images: IImage[] | any;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostForm {
  title: string;
  address: string;
  shortDescription: string;
  detail: string;
  categoryId: number;
  priceId: number;
  areaId: number;
  priceNumber: number;
  areaNumber: number;
  images: string[];
  target: string;
  status: string;
}

export interface TypeDefault {
  code: string;
  value: string;
}

export interface Province {
  province_id: string;
  province_name: string;
  province_type: string;
}

export interface District {
  district_id: string;
  district_name: string;
  district_type: string;
  province_id: string;
}

export interface Ward {
  district_id: string;
  ward_id: string;
  ward_name: string;
  ward_type: string;
}

export interface UserPersonal extends IUser {
  followersCount: number;
  followingCount: number;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: IUser;
}

export interface SavePostProp {
  id: number;
  postId: number;
  userId: number;
  post: IPost;
  createdAt: string;
  updatedAt: string;
}
