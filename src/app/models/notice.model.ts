export class Notice {
    id?: string;
    title!: string;
    type?: string;
    message!: string;
    senderId!: string;
    created_at!: string;
    readBy?: string[];
    hasRead?: boolean;
}