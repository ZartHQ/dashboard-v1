export interface FlagPerson {
  initials: string;
  bg: string;
  color: string;
  name: string;
}

export interface Flag {
  id: number;
  title: string;
  sub: string;
  priority: "high" | "medium" | "low";
  status: string;
  time: string;
  desc: string;
  artisan: FlagPerson;
  patron: FlagPerson;
  actions: string[];
}
