
export interface AnuncioDTO {
    idMensaje: number;
    titulo: string;
    contenidoDelMensaje: string;
    fechaMensaje: string; // ISO 8601 format (e.g., 2024-12-03T10:00:00)
    esAudio: boolean;
    idResidente: number | null; // Null si no está asociado a un residente
  }
  