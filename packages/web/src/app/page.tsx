"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main>
      {/* HERO SECTION */}
      <div className="relative min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 pt-16 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-[120%] h-[120%] top-0 left-0 bg-[radial-gradient(circle,white_10%,transparent_70%)] opacity-50" />

          <div className="absolute w-80 h-80 bg-pink-200 rounded-full blur-3xl animate-blob-move-1" />
          <div className="absolute w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-blob-move-2" />
          <div className="absolute w-72 h-72 bg-yellow-100 rounded-full blur-3xl animate-blob-move-3" />
        </div>

        {/* Hero content */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-heading text-black max-w-2xl leading-tight">
            Launch. Collect. Swap. Just Vibe.
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-[32ch] leading-relaxed text-center mx-auto">
            The chillest way to drop tokens, mint NFTs, and swap like a pro — no
            stress, no clutter.
          </p>
          <button
            className="mt-8 ui-button primary"
            onClick={() => router.push("/app")}
          >
            Dive In
          </button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="w-full bg-gray-100">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-300">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center justify-between p-10 flex-1"
            >
              <div className="md:w-1/2 text-center md:text-left">
                <h3 className="text-2xl font-heading">{feature.title}</h3>
              </div>

              <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
                {feature.animation === "tokens" && <TokenLaunchAnimation />}
                {feature.animation === "nfts" && <NFTAnimation />}
                {feature.animation === "swap" && <SwapAnimation />}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMING SOON TEASER SECTION */}
      <section className="relative bg-black text-white py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 animate-thunder-flash-1" />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-transparent to-purple-500 opacity-0 animate-thunder-flash-2" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-heading mb-6 text-white flicker-glow"
          >
            Something Legendary Is Cooking...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-300 mb-10"
          >
            Blink and you&apos;ll miss it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="flex justify-center"
          >
            <Image
              src="/token.png"
              alt="Coming Soon Token"
              width={200}
              height={200}
              className="rounded-full thunder-image"
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    title: "Token Launches",
    animation: "tokens",
  },
  {
    title: "NFTs",
    animation: "nfts",
  },
  {
    title: "Swap",
    animation: "swap",
  },
];

// Token Launch Animation (pulse ring)
function TokenLaunchAnimation() {
  return (
    <div className="relative w-24 h-32 flex justify-between items-end gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 bg-cyan-300 rounded-full"
          animate={{
            height: ["30%", "100%", "30%"],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// NFT Animation (shimmering grid)
function NFTAnimation() {
  return (
    <div className="relative w-28 h-28">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-full rounded-md bg-purple-400/30 border border-purple-300"
          animate={{ y: [10 * i, 0, 10 * i], opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Swap Animation (looping arrows)
function SwapAnimation() {
  return (
    <motion.div
      className="relative w-24 h-24 rounded-full border-2 border-yellow-400"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
    >
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-300 rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-yellow-300 rounded-full" />
    </motion.div>
  );
}
