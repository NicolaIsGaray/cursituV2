export class Notice {
    id?: string;
    title!: string;
    type!: string;
    message!: string;
    emisor_id!: string;
    created_at!: string;
    read_by?: string[];
}