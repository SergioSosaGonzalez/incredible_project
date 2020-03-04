import {Permissionkeys} from './authorization/permission-keys';

export interface RequiredPermissions {
  required: Permissionkeys[];
}

export interface MyUserProfile {
  id: string;
  email?: string;
  name: string;
  permission: Permissionkeys[];
}
