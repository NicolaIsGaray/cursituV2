// entrega.model.ts
export type FormatoEntrega = 'archivo' | 'carpeta' | 'texto';

export interface DetalleEntrega {
  titulo: string;
  materia: string;
  fechaLimite: Date; // Usar Date para formatear dinámicamente
  materiaColor: string;
}