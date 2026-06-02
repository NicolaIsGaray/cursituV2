export class Assignment {
    id?: string;
    title!: string;
    content!: string;
    subject_name!: string;
    date_limit!: Date;
    allowed_format!: string;
    type!: string;
    deliverMode!: string;
    enabled_to_deliver!: boolean;
    subject_id!: string;
    sentBy?: string[];
}