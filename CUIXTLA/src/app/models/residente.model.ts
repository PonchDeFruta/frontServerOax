export interface Residente {
  nombre: string;
  apellido: string;
  apodo: string;
  comercio: string;
  domicilio: {
    direccion: string;
    referencia: string;
    coordenadas: string;
  } | null; // `null` se permite si no hay domicilio
}
