import { Date } from "./date.model"
import { User } from "./user.model"

export type Subject = {
    id: string,
    subject_name: string,
    color: string,
    professor_id: string,
    professorData?: User,
    classroom_id: string,
    year_level: number,
    academic_period: number,
    important_dates: Date[] 
}