export interface Message {
  id: number;
  matchId: number;
  sender: string;
  content: string;
  timestamp: Date;
  messageStatus: string; // TODO?: enum?
}
