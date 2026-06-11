/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "http2.mlstatic.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.tcdn.com.br" },
      { protocol: "https", hostname: "store-images.s-microsoft.com" },
      { protocol: "https", hostname: "images8.kabum.com.br" },
      { protocol: "https", hostname: "images6.kabum.com.br" },
      { protocol: "https", hostname: "imgs.pontofrio.com.br" },
      { protocol: "https", hostname: "cdn.dooca.store" },
      { protocol: "https", hostname: "alfatecnologico.com.br" },
      { protocol: "https", hostname: "img.kalunga.com.br" },
      { protocol: "https", hostname: "encrypted-tbn2.gstatic.com" },
      { protocol: "https", hostname: "down-br.img.susercontent.com" },
      { protocol: "https", hostname: "assets.nintendo.com" },
      { protocol: "https", hostname: "image.api.playstation.com" },
      { protocol: "https", hostname: "cdn.awsli.com.br" },
      { protocol: "https", hostname: "imagedelivery.net" },
      { protocol: "https", hostname: "img.terabyteshop.com.br" },
      { protocol: "https", hostname: "cdn1.epicgames.com" },
      { protocol: "https", hostname: "fastshopbr.vtexassets.com" },
    ],
  },
};

module.exports = nextConfig;