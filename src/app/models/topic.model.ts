import { FileDTO } from "./dto/fileDTO";

export class Topic {
    id?: string;
    title!: string;
    content!: string[];
    assignmentId?: string;
    files?: FileDTO[];
    classroom_id!: string;
}