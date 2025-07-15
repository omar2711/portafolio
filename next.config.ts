import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      path: false,
      crypto: false,
    };
    
    // Configurar para archivos .onnx y .wasm
    config.module.rules.push({
      test: /\.onnx$/,
      use: 'file-loader',
    });
    
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });
    
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['onnxruntime-web'],
  },
  // Asegurar que los archivos WASM se sirvan correctamente
  async headers() {
    return [
      {
        source: '/onnx/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
}

export default nextConfig