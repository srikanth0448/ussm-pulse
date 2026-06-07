import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
export default defineConfig(({ mode }) => {

  return {
    base: mode === 'development' ? '/' : '/testing/react/usm-pulse/',
    plugins: [react()],
   
  };
});