import { HeatMap as HeatMapType, HeatMapResolvers, TimePiece } from '../generated/types';
import { endToStart } from '../utils/utils';
import { daysBetween } from '../utils/date';

export const HeatMap: HeatMapResolvers = {
  data: async ({ data }) => {
    return data;
  },
  end: async ({ end }) => {
    return end;
  },
  start: async ({ start }) => {
    return start;
  },
};

export function parseHeatMapFromTimePieces(timePieces: TimePiece[], end: Date): HeatMapType {
  const data = new Array(365).fill(0);
  const start = endToStart(end, 365);
  timePieces.forEach((tp) => {
    const day = daysBetween(start, tp.start);
    data[day] += tp.duration;
  });
  return { data: data, end: end, start: start };
}
