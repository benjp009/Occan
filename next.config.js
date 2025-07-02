/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SHEET_CSV_URL: process.env.NEXT_PUBLIC_SHEET_CSV_URL,
    NEXT_PUBLIC_ADMIN_PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
    NEXT_PUBLIC_MONTH_CHOICE_CSV_URL: process.env.NEXT_PUBLIC_MONTH_CHOICE_CSV_URL,
  },
};

module.exports = nextConfig;
