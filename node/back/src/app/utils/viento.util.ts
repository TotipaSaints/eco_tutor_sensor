export function obtenerDireccion(angulo: number): Promise<string> {
  if (angulo >= 337.5 || angulo < 22.5) return Promise.resolve('Norte');
  if (angulo >= 22.5 && angulo < 45) return Promise.resolve('Norte-Noreste');
  if (angulo >= 45 && angulo < 67.5) return Promise.resolve('Noreste');
  if (angulo >= 67.5 && angulo < 90) return Promise.resolve('Este-Noreste');
  if (angulo >= 90 && angulo < 112.5) return Promise.resolve('Este');
  if (angulo >= 112.5 && angulo < 135) return Promise.resolve('Este-Sureste');
  if (angulo >= 135 && angulo < 157.5) return Promise.resolve('Sureste');
  if (angulo >= 157.5 && angulo < 180) return Promise.resolve('Sur-Sureste');
  if (angulo >= 180 && angulo < 202.5) return Promise.resolve('Sur');
  if (angulo >= 202.5 && angulo < 225) return Promise.resolve('Sur-Oeste');
  if (angulo >= 225 && angulo < 247.5) return Promise.resolve('Oeste-Sureste');
  if (angulo >= 247.5 && angulo < 270) return Promise.resolve('Oeste');
  if (angulo >= 270 && angulo < 292.5) return Promise.resolve('Oeste-Noroeste');
  if (angulo >= 292.5 && angulo < 315) return Promise.resolve('Noroeste');
  if (angulo >= 315 && angulo < 337.5) return Promise.resolve('Norte-Noroeste');
  return Promise.resolve('Desconocido');
}
