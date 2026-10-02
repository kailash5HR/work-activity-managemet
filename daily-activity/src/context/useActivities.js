import { useContext } from "react";
import { ActivityContext } from "./activityContext";

export function useActivities() {
  return useContext(ActivityContext);
}