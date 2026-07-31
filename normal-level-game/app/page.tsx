import type { Metadata } from "next";
import { NormalLevelGame } from "./NormalLevelGame";

export const metadata: Metadata = {
  title: "仓鼠防线 · 正常关卡",
  description: "基于已还原主线配置运行的正常关卡战斗原型。",
};

export default function Home() {
  return <NormalLevelGame />;
}
