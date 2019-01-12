import babel from "rollup-plugin-babel";

export default {
  input: "src/index.js",
  output: ["cjs", "esm"].map(format => ({
    file: `dist/bundle.${format}.js`,
    format,
  })),
  plugins: [babel({ exclude: "node_modules/**" })],
};
