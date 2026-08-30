/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages에서 서버 없이 정적 사이트로 제공하도록 빌드합니다.
  output: 'export',
  // 개발 서버를 켠 채로도 별도 폴더에서 배포 빌드를 검증할 수 있습니다.
  distDir: process.env.MATH_PROMO_DIST_DIR || '.next',
  // 정적 페이지 수집 단계의 메모리 급증을 피하기 위해 빌드 작업자를 하나로 제한합니다.
  experimental: {
    cpus: 1,
    webpackBuildWorker: false,
  },
};

export default nextConfig;
