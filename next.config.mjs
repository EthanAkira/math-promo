/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 서버를 켠 채로도 별도 폴더에서 배포 빌드를 검증할 수 있습니다.
  distDir: process.env.MATH_PROMO_DIST_DIR || '.next',
};

export default nextConfig;
