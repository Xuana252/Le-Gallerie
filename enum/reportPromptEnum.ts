import { IconDefinition } from "@node_modules/@fortawesome/fontawesome-svg-core";
import {
  faCircleExclamation,
  faUserSlash,
  faBan,
  faCircleQuestion,
  faScaleBalanced,
} from "@node_modules/@fortawesome/free-solid-svg-icons";

export enum ReportPrompt {
  SPAM = "Spam",
  HARASSMENT = "Harassment or bullying",
  INAPPROPRIATE = "Inappropriate or offensive content",
  FALSE_INFO = "False information",
  IP_VIOLATION = "Intellectual property violation",
}

export const reportIcons: Record<keyof typeof ReportPrompt, IconDefinition> = {
  SPAM: faCircleExclamation,
  HARASSMENT: faUserSlash,
  INAPPROPRIATE: faBan,
  FALSE_INFO: faCircleQuestion,
  IP_VIOLATION: faScaleBalanced,
};
