import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  vite: {
    preview: {
      allowedHosts: [
        "smartgymcr.onrender.com",
        "smartgymcr.com",
        "www.smartgymcr.com"
      ]
    }
  }
});
