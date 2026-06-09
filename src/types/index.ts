export interface Persona {
  id: string;
  name: string;
  role: string;
  age: number;
  avatar: string;
  color: string;
  background: string;
  goals: string[];
  frustrations: string[];
  motto: string;
}

export interface UserStory {
  id: string;
  persona: string;
  priority: 'high' | 'medium' | 'low';
  release: 1 | 2 | 3;
  activity: string;
  title: string;
  story: string;
  acceptanceCriteria: string[];
}

export interface StoryMapActivity {
  id: string;
  name: string;
  icon: string;
  steps: StoryMapStep[];
}

export interface StoryMapStep {
  id: string;
  name: string;
  stories: string[];
}

export interface Release {
  id: number;
  name: string;
  color: string;
  borderColor: string;
}

export type Priority = 'high' | 'medium' | 'low';
export type ReleaseNumber = 1 | 2 | 3;
