export interface user_firebase_rtdb_value {
    email: string;
    profile_pic: string;
    username: string;
    verified: boolean;
}

export interface user_firebase_rtdb {
    [user_id: string]: user_firebase_rtdb_value;
}
