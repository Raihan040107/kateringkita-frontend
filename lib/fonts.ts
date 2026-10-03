import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
export const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-sans" });
export const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-mono" });
export const fontClass = `${sans.variable} ${mono.variable} font-[family-name:var(--font-sans)]`;
