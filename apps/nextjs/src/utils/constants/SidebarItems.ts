import { BiSolidBarChartSquare } from "react-icons/bi";
import {
  FaChartLine,
  FaChartPie,
  FaMagnifyingGlassChart,
} from "react-icons/fa6";

import type { SidebarItemProps } from "~/components/molecules/SidebarItem";
import {
  ANALYZE,
  ECO_SCORE,
  HOME,
  INITIATIVE_MANAGEMENT,
  MONITOR,
  PERFORMANCE,
  PRODUCT_SCORE,
  REPORT,
  SUMMARY_BY_ESTABLISHMENT,
  SUMMARY_BY_PRODUCT,
} from "./routes";

export const SidebarItems: SidebarItemProps[] = [
  {
    title: "home",
    path: HOME,
    Icon: FaChartPie,
  },
  {
    title: "monitor",
    path: MONITOR,
    Icon: FaMagnifyingGlassChart,
    accordionValues: [
      { itemKey: "summaryByEstablishment", subpath: SUMMARY_BY_ESTABLISHMENT },
      { itemKey: "summaryByProduct", subpath: SUMMARY_BY_PRODUCT },
    ],
  },
  {
    title: "analyze",
    path: ANALYZE,
    Icon: FaChartLine,
    accordionValues: [
      { itemKey: "performancePerKpi", subpath: PERFORMANCE },
      { itemKey: "initiativeManagement", subpath: INITIATIVE_MANAGEMENT },
    ],
  },
  {
    title: "report",
    path: REPORT,
    Icon: BiSolidBarChartSquare,
    accordionValues: [
      { itemKey: "ecoScore", subpath: ECO_SCORE },
      { itemKey: "productScore", subpath: PRODUCT_SCORE },
    ],
  },
];
