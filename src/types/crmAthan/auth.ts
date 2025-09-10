export type MasterType = {
    master_id: number
    name: string
    email: string
    passwordResetToken: string
    passwordResetExpires: Date
    image_profile_id: number | null
    created_at: Date
    active: number
    file_drive_id: number | null
    file_drive_url: string | null
    file_name: string | null
    auth: {
      master_id: number
      name: string
      token: string
      type: string
    }
}

export type UserType = {
    tenant_id: number;
    name: string;
    user_id?: number;
    admin_id?: number;    
    company_id: number;
    image_profile_id: null;
    file_drive_id: null;
    file_drive_url: string;
    file_name: null;
    ramal: number;
    type: 'agent' | 'admin' | 'master';
    tenant: string;
    email: string;
    token: string;
}

export type AuthType = {
    auth: UserType[];
    master?: MasterType;
}