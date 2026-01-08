// vite.config.ts
import { defineConfig } from "file:///home/nyaencha/Music/m&e/clickup-sync/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///home/nyaencha/Music/m&e/clickup-sync/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
    // Proxy is only used when VITE_API_URL is not set (i.e., pure localhost development)
    // When accessing via network IP, the API URL should be configured via .env.development.local
    proxy: process.env.VITE_API_URL ? void 0 : {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      },
      "/ws": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9ueWFlbmNoYS9NdXNpYy9tJmUvY2xpY2t1cC1zeW5jL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9ueWFlbmNoYS9NdXNpYy9tJmUvY2xpY2t1cC1zeW5jL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL255YWVuY2hhL011c2ljL20mZS9jbGlja3VwLXN5bmMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMSxcbiAgICBob3N0OiB0cnVlLFxuICAgIC8vIFByb3h5IGlzIG9ubHkgdXNlZCB3aGVuIFZJVEVfQVBJX1VSTCBpcyBub3Qgc2V0IChpLmUuLCBwdXJlIGxvY2FsaG9zdCBkZXZlbG9wbWVudClcbiAgICAvLyBXaGVuIGFjY2Vzc2luZyB2aWEgbmV0d29yayBJUCwgdGhlIEFQSSBVUkwgc2hvdWxkIGJlIGNvbmZpZ3VyZWQgdmlhIC5lbnYuZGV2ZWxvcG1lbnQubG9jYWxcbiAgICBwcm94eTogcHJvY2Vzcy5lbnYuVklURV9BUElfVVJMID8gdW5kZWZpbmVkIDoge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICAnL3dzJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjQwMDAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFQsU0FBUyxvQkFBb0I7QUFDelYsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQTtBQUFBLElBR04sT0FBTyxRQUFRLElBQUksZUFBZSxTQUFZO0FBQUEsTUFDNUMsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsTUFDQSxPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
