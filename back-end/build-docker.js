// libs
import { build } from "esbuild";

async function runBuild() {
    try {
        await build({
            entryPoints: ["src/server.ts"],
            bundle: true,
            platform: "node",
            target: "node20",
            format: "cjs",
            outfile: "dist/src/index.cjs",
            sourcemap: true,
            minify: true,
            // external: ["express", ...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
        });

        console.log("✅ Build success!");
    } catch (error) {
        console.error("Build failed:", error);
        process.exit(1);
    }
}

await runBuild();
