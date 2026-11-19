"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import Container from "@/components/Shared/Container";
import { motion } from "framer-motion";

export default function MidBannerSection({ banner }) {
    if (!banner || !banner.image) return null;

    return (
        <motion.section initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="w-full py-4 sm:py-6 font-sans">
            <Container>
                <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#EDE5DC] aspect-[16/6] sm:aspect-[21/7] md:aspect-[3.2/1] min-h-[180px] sm:min-h-[220px] md:min-h-[260px] bg-stone-900 flex items-center">
                    
                    {/* Background Banner Image */}
                    <Image
                        src={banner.image}
                        alt={banner.title || "Glow Korean Beauty Mid Banner"}
                        fill
                        unoptimized
                        priority
                        className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
                        sizes="(max-width: 1280px) 100vw, 1280px"
                    />

                    {/* Aesthetic Korean Glass Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent pointer-events-none" />

                    {/* Ambient Glows */}
                    <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#D48B80]/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#B88348]/25 rounded-full blur-3xl pointer-events-none" />

                    {/* Banner Content */}
                    <div className="relative z-10 p-6 sm:p-10 md:p-12 text-white max-w-2xl">
                        {banner.category && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#FAF7F2] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-3">
                                <Sparkles size={11} className="text-[#D48B80]" />
                                <span>{banner.category}</span>
                            </div>
                        )}

                        {banner.title && (
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight mb-2 drop-shadow-sm">
                                {banner.title}
                            </h2>
                        )}

                        {banner.sub_title && (
                            <p className="text-xs sm:text-sm md:text-base text-[#EDE3DE] line-clamp-2 mb-5 font-normal leading-relaxed max-w-lg">
                                {banner.sub_title}
                            </p>
                        )}

                        {banner.link && (
                            <Link
                                href={banner.link}
                                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-[#D48B80] to-[#B88348] hover:from-[#C47A70] hover:to-[#A77338] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                            >
                                <span>Explore Collection</span>
                                <ArrowRight size={14} />
                            </Link>
                        )}
                    </div>

                    {/* Clickable Area if banner has a link */}
                    {banner.link && (
                        <Link
                            href={banner.link}
                            className="absolute inset-0 z-0"
                            aria-label={banner.title || "Explore Banner"}
                        />
                    )}
                </div>
            </Container>
        </motion.section>
    );
}
