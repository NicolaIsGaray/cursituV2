import { Date } from "./date.model"

export class Subject {
    id?: string;
    subject_name!: string;
    color!: string;
    professor_id!: string;
    classroom_id?: string;
    year_level!: number;
    academic_period!: number[];
    important_dates?: Date[];
}