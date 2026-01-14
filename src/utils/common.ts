import { config } from "../config/env";

export const BASE_URL = config.apiBaseUrl;

export const EMAIL_VALIDATION = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
};

export const TABS = ["expenses", "income", "category"];

export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Shared color palettes for charts

export const CHART_COLORS = [
  "rgba(255, 99, 132, 0.7)",
  "rgba(54, 162, 235, 0.7)",
  "rgba(255, 206, 86, 0.7)",
  "rgba(75, 192, 192, 0.7)",
  "rgba(153, 102, 255, 0.7)",
  "rgba(255, 159, 64, 0.7)",
  "rgba(255, 99, 71, 0.7)",
  "rgba(106, 90, 205, 0.7)",
];

export const CHART_BORDER_COLORS = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(255, 99, 71, 1)",
  "rgba(106, 90, 205, 1)",
];

// Utility to generate more colors if needed
function generateColor(index: number, alpha: number = 0.7) {
  // Generate HSL color evenly spaced around the color wheel
  const hue = (index * 137.508) % 360; // use golden angle for good distribution
  return `hsla(${hue}, 65%, 60%, ${alpha})`;
}

export function getChartColors(count: number, alpha: number = 0.7) {
  const base = CHART_COLORS.slice();
  const colors = [];
  for (let i = 0; i < count; i++) {
    if (i < base.length) {
      colors.push(base[i]);
    } else {
      colors.push(generateColor(i, alpha));
    }
  }
  return colors;
}

export function getChartBorderColors(count: number) {
  const base = CHART_BORDER_COLORS.slice();
  const colors = [];
  for (let i = 0; i < count; i++) {
    if (i < base.length) {
      colors.push(base[i]);
    } else {
      colors.push(generateColor(i, 1));
    }
  }
  return colors;
}
