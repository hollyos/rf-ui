// Shared domain types used across components.

export interface NavItem {
  id: string;
  label: string;
  children?: NavItem[];
}

export interface EventInfo {
  name: string;
  date: string;
  location: string;
  shortLocation: string;
}

export interface WorkflowItem {
  id: string;
  title: string;
  description: string;
}

export interface BaseSettingItem {
  id: string;
  title: string;
  description: string;
}
