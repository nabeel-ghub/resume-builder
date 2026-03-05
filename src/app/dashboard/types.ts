export type section = {
  id: string;
  title: string;
  role: string;
  link?: string;
  description: string;
  bullet1: string | null;
  bullet2: string | null;
  bullet3: string | null;
};

export type resume = {
    id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  summary: string;
  skills: string[];
  linkedin: string;
  github: string;
  experience: section[];
  projects: section[];
  education: section[];
}

export type skill = {
    id: number;
    title: string;
}
