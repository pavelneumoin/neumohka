import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // PDF поставляются отдельным защищённым каталогом в NEUMOSHKA_STORAGE_ROOT.
  // Не дублируем 90+ MiB материалов внутри deployable standalone-трейса.
  outputFileTracingExcludes: {
    "/*": ["./private/**/*", "./out/**/*"],
  },
};

export default nextConfig;
