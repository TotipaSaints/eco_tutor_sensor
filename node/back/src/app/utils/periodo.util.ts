import { DateTime } from 'luxon';

export const calcularPromedioPorPeriodo = async (
  sensorModel,
  periodo: 'dia' | 'semana' | 'mes' | 'año',
): Promise<number> => {
  let filtroFecha: any;

  switch (periodo) {
    case 'dia':
      filtroFecha = {
        fecha: {
          $gte: DateTime.now().startOf('day').toJSDate(),
          $lte: DateTime.now().endOf('day').toJSDate(),
        },
      };
      break;
    case 'semana':
      filtroFecha = {
        fecha: {
          $gte: DateTime.now().startOf('week').toJSDate(),
          $lte: DateTime.now().endOf('week').toJSDate(),
        },
      };
      break;
    case 'mes':
      filtroFecha = {
        fecha: {
          $gte: DateTime.now().startOf('month').toJSDate(),
          $lte: DateTime.now().endOf('month').toJSDate(),
        },
      };
      break;
    case 'año':
      filtroFecha = {
        fecha: {
          $gte: DateTime.now().startOf('year').toJSDate(),
          $lte: DateTime.now().endOf('year').toJSDate(),
        },
      };
      break;
  }

  const sensores = await sensorModel.find(filtroFecha).exec();

  if (sensores.length === 0) {
    return 0;
  }

  const sumaTemperaturas = sensores.reduce(
    (acc, sensor) => acc + parseFloat(sensor.temperatura_ambiental),
    0,
  );
  return sumaTemperaturas / sensores.length;
};
