import { Position } from 'reactflow';

export const POSITION_MAP: Record<string, Position> = {
  T: Position.Top,
  L: Position.Left,
  R: Position.Right,
  B: Position.Bottom,
} as const;
