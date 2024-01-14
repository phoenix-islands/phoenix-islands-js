// vite.config.ts
import { resolve } from "node:path";
import { defineConfig } from "file:///Users/cinoss/Code/usage.so/phoenix-islands-js/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/cinoss/Code/usage.so/phoenix-islands-js/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/cinoss/Code/usage.so/phoenix-islands-js/packages/core";
var vite_config_default = defineConfig({
  plugins: [dts({ include: ["src"] })],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "myLib",
      formats: ["es", "cjs", "umd"],
      fileName: "index"
    },
    rollupOptions: {
      external: ["nanostores", "morphdom"],
      output: { globals: { nanostores: "Nanostores", morphdom: "Morphdom" } }
    }
  },
  test: {
    globals: true,
    include: ["test/*.test.ts"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2lub3NzL0NvZGUvdXNhZ2Uuc28vcGhvZW5peC1pc2xhbmRzLWpzL3BhY2thZ2VzL2NvcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jaW5vc3MvQ29kZS91c2FnZS5zby9waG9lbml4LWlzbGFuZHMtanMvcGFja2FnZXMvY29yZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY2lub3NzL0NvZGUvdXNhZ2Uuc28vcGhvZW5peC1pc2xhbmRzLWpzL3BhY2thZ2VzL2NvcmUvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbZHRzKHsgaW5jbHVkZTogWydzcmMnXSB9KV0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdteUxpYicsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ2NqcycsICd1bWQnXSxcbiAgICAgIGZpbGVOYW1lOiAnaW5kZXgnXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWyduYW5vc3RvcmVzJywgJ21vcnBoZG9tJ10sXG4gICAgICBvdXRwdXQ6IHsgZ2xvYmFsczogeyBuYW5vc3RvcmVzOiAnTmFub3N0b3JlcycsIG1vcnBoZG9tOiAnTW9ycGhkb20nIH0gfVxuICAgIH1cbiAgfSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgaW5jbHVkZTogWyd0ZXN0LyoudGVzdC50cyddXG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUhoQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQUEsRUFDbkMsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsTUFBTSxPQUFPLEtBQUs7QUFBQSxNQUM1QixVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLGNBQWMsVUFBVTtBQUFBLE1BQ25DLFFBQVEsRUFBRSxTQUFTLEVBQUUsWUFBWSxjQUFjLFVBQVUsV0FBVyxFQUFFO0FBQUEsSUFDeEU7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxTQUFTLENBQUMsZ0JBQWdCO0FBQUEsRUFDNUI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
