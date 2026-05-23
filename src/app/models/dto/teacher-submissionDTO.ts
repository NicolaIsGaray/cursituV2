export interface TeacherSubmissionDTO {
  studentId: string;
  studentName: string;
  submissionId?: string;
  fileUrl?: string;
  submissionDate?: string;
  isLate: boolean;
  grade?: number;
  status: 'PENDIENTE' | 'CORREGIDO' | 'SIN_ENTREGAR';
}