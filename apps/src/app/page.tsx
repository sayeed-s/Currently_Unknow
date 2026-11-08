"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Play,
  ShieldCheck,
  Wallet,
  Sparkles,
  ArrowRight,
  Clock,
  Coins,
} from "lucide-react";
import { Show } from "@clerk/nextjs";

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-[#C6A15B] selection:text-black overflow-x-hidden">
      {/* Background Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C6A15B]/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-[#C6A15B]/10 border border-[#C6A15B]/30 flex items-center justify-center">
            <Play className="size-4 text-[#C6A15B] fill-[#C6A15B]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Stream<span className="text-[#C6A15B]">Platform</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Show when={"signed-out"}>
            <Link href="/home">
              <Button
                variant="outline"
                className="border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl px-5 text-xs font-semibold backdrop-blur-md cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
          </Show>
          <Show when={"signed-in"}>
            <Link href="/home">
              <Button className="bg-[#C6A15B] hover:bg-[#b08d4a] text-black font-semibold rounded-xl px-5 text-xs transition-all shadow-lg shadow-[#C6A15B]/20 cursor-pointer">
                Explore Platform
              </Button>
            </Link>
          </Show>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto space-y-6"
        >
          <motion.div variants={fadeInUp} className="inline-block">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-[#C6A15B]/30 text-[#C6A15B] text-xs font-medium backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>Next-Gen Pay-Per-View & Masterclass Streaming</span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Stream Premium Content. <br />
            <span className="bg-gradient-to-r from-[#C6A15B] via-amber-200 to-[#C6A15B] bg-clip-text text-transparent">
              Pay Only For What You Watch.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            No monthly subscriptions required. Enjoy flexible 48-hour video
            rentals or unlock lifetime access with transparent micro-wallet
            payouts.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/home" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#C6A15B] hover:bg-[#b08d4a] text-black font-bold h-12 px-8 rounded-xl text-sm transition-all shadow-xl shadow-[#C6A15B]/20 cursor-pointer flex items-center justify-center gap-2">
                <span>Start Watching Now</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/home" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 rounded-xl border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:text-white hover:bg-zinc-900 text-sm font-semibold backdrop-blur-md cursor-pointer"
              >
                Creator Studio Login
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Interactive Player Showcase Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative max-w-5xl mx-auto rounded-3xl p-2 bg-gradient-to-b from-zinc-800/80 to-zinc-950 border border-zinc-800/80 shadow-2xl shadow-black/80"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/60 group">
            <Image
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80"
              alt="Video Showcase Player"
              fill
              className="object-cover opacity-60 group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="size-16 sm:size-20 rounded-full bg-[#C6A15B] text-black flex items-center justify-center shadow-2xl shadow-[#C6A15B]/40 group-hover:scale-110 transition duration-300 cursor-pointer">
                <Play className="size-8 fill-black translate-x-0.5" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-black/80 border border-white/10 backdrop-blur-md text-xs font-semibold text-zinc-300">
                <Clock className="size-3.5 text-[#C6A15B]" />
                <span>48-Hour Rental Window • Instant HD Playback</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-zinc-800/60">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-xs font-bold tracking-widest text-[#C6A15B] uppercase">
            Platform Capabilities
          </h2>
          <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything Built For Digital Creators & Viewers
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            variants={fadeInUp}
            className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-4 backdrop-blur-sm"
          >
            <div className="size-12 rounded-xl bg-[#C6A15B]/10 border border-[#C6A15B]/20 flex items-center justify-center text-[#C6A15B]">
              <Coins className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Flex Monetization</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Set custom 48-hour rental prices or offer lifetime purchases. No
              forced subscription bundles for your audiences.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-4 backdrop-blur-sm"
          >
            <div className="size-12 rounded-xl bg-[#C6A15B]/10 border border-[#C6A15B]/20 flex items-center justify-center text-[#C6A15B]">
              <Wallet className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Creator Wallet Payouts
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Instantly track video earnings and channel memberships with
              automated wallet balance calculations and zero overhead.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-4 backdrop-blur-sm"
          >
            <div className="size-12 rounded-xl bg-[#C6A15B]/10 border border-[#C6A15B]/20 flex items-center justify-center text-[#C6A15B]">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Powered By Mux Stream
            </h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Lightning-fast video processing and secure adaptive bitrate
              streaming backed by robust Mux playback IDs.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Call To Action Footer Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-8 sm:p-14 overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to experience friction-free streaming?
            </h2>
            <p className="text-sm text-zinc-400 font-light">
              Join creators and viewers operating on transparent pay-per-video
              access.
            </p>
          </div>
          <Link href="/home" className="shrink-0">
            <Button className="bg-[#C6A15B] hover:bg-[#b08d4a] text-black font-bold h-12 px-8 rounded-xl text-sm transition-all shadow-xl shadow-[#C6A15B]/20 cursor-pointer">
              Launch Platform Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
