export interface UserWithMFA {
    id: number;
    role?: string;
    is_mfa_active?: boolean;
}