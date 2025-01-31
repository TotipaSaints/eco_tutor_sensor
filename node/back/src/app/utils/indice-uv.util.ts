import { NivelIndiceUV } from '../openuv/type/nivel-indice-uv.enum';

export function obtenerNivelIndiceUV(indiceUV: number): string {
  if (indiceUV >= 0 && indiceUV <= 2) {
    return NivelIndiceUV.Bajo;
  } else if (indiceUV >= 3 && indiceUV <= 5) {
    return NivelIndiceUV.Moderado;
  } else if (indiceUV >= 6 && indiceUV <= 7) {
    return NivelIndiceUV.Alto;
  } else if (indiceUV >= 8 && indiceUV <= 10) {
    return NivelIndiceUV.MuyAlto;
  } else {
    return NivelIndiceUV.Extremo;
  }
}
