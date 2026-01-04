import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "mvlcc84s",
  dataset: "production",
  apiVersion: "2025-07-09",
  useCdn: false,
});