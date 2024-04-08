export const EMessageType = { EMAIL: 'EMAIL', SMS: 'SMS' } as const;

export type EMessageType = keyof typeof EMessageType;
