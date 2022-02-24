export const MESSAGE_TYPE = {
  REQUEST: 'REQUEST',
} as const;

export type Message = { type: typeof MESSAGE_TYPE.REQUEST; payload: string };
