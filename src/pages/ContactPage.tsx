import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Send, Loader2, Mail, Phone, MapPin, Github, Linkedin, FileText, Sparkles, MessageSquare, User } from 'lucide-react';
import TechNav from '@/components/TechNav';
import Footer from '@/components/Footer';
import ProjectPattern from '@/components/ProjectPattern';
import SEOKeywords from '@/components/SEOKeywords';
import SEO from '@/components/SEO';
import { toast } from '@/hooks/use-toast';

const RESUME_URL = "https://drive.google.com/file/d/1NmangaAFo0eGT-KAsZi4VWOm6zI-KPk6/view?usp=sharing";

const categories = [
    "Hire Me",
    "Freelance Work",
    "General"
];

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('sowmisowmiyan58@gmail.com');
        setCopiedEmail(true);
        toast({
            title: "Email Copied",
            description: "sowmisowmiyan58@gmail.com copied to clipboard."
        });
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            toast({
                title: "Incomplete Fields",
                description: "Please fill out your name, email, and message.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        const payload = {
            "Sender Name": name.trim(),
            "Sender Email": email.trim(),
            "Inquiry Type": category,
            "Message": message.trim(),
            _subject: `[Portfolio Inquiry] ${category} from ${name.trim()}`,
            _replyto: email.trim(),
            _template: 'table',
            _captcha: 'false',
            _autoresponse: `Hi ${name.trim()},\n\nThank you for reaching out through my portfolio. I have received your message regarding "${category}" and will reply to you directly within 24 hours.\n\nBest regards,\nSowmiyan S\nAI Engineer & Full-Stack Developer\nhttps://www.sowmiyan.me`
        };

        let delivered = false;

        // Provider 1: FormSubmit AJAX
        try {
            const res = await fetch('https://formsubmit.co/ajax/sowmisowmiyan58@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                delivered = true;
            }
        } catch (e) {
            console.warn("FormSubmit endpoint notice:", e);
        }

        // Provider 2: Web3Forms fallback if primary endpoint had issues
        if (!delivered) {
            try {
                const res2 = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: "099a224d-5878-43d9-959c-851532f6a6dc", // public contact key fallback
                        name: name.trim(),
                        email: email.trim(),
                        subject: `[Portfolio Contact] ${category} - ${name.trim()}`,
                        message: `Inquiry Type: ${category}\n\n${message.trim()}`
                    })
                });
                if (res2.ok) {
                    delivered = true;
                }
            } catch (e2) {
                console.warn("Web3Forms fallback notice:", e2);
            }
        }

        setIsSubmitting(false);

        if (delivered) {
            setSubmitStatus('success');
            toast({
                title: "Message Delivered Successfully!",
                description: "Your inquiry has been sent to sowmisowmiyan58@gmail.com. I will reply within 24 hours."
            });
        } else {
            setSubmitStatus('error');
            toast({
                title: "Direct Client Routing Available",
                description: "You can send directly via your email client or WhatsApp below.",
                variant: "destructive"
            });
        }
    };

    const getWhatsAppUrl = () => {
        const text = `Hi Sowmiyan, my name is ${name || 'there'}.\n\nInquiry Type: ${category}\nEmail: ${email || 'N/A'}\n\nMessage: ${message || 'I would like to discuss an opportunity with you.'}`;
        return `https://wa.me/919042561295?text=${encodeURIComponent(text)}`;
    };

    const handleMailtoFallback = () => {
        const mailtoUrl = `mailto:sowmisowmiyan58@gmail.com?subject=${encodeURIComponent(
            `Inquiry: ${category} - ${name || 'Prospective Partner'}`
        )}&body=${encodeURIComponent(
            `Hi Sowmiyan,\n\nMy name is ${name}.\nType: ${category}\nEmail: ${email}\n\n${message}`
        )}`;
        window.location.href = mailtoUrl;
    };

    return (
        <div className="relative min-h-screen text-white bg-[#0a0a0a] selection:bg-red-600 font-sans antialiased overflow-x-hidden">
            <SEO 
                title="Contact — Sowmiyan S | AI Engineer & Full-Stack Developer"
                description="Get in touch with Sowmiyan S for software engineering opportunities, AI projects, and freelance full-stack applications."
                canonical="https://www.sowmiyan.me/contact"
            />
            <SEOKeywords />

            <ProjectPattern>
                <TechNav />

                <main className="relative z-10 pt-24 md:pt-32 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
                    
                    {/* Header */}
                    <div className="flex flex-col gap-4 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit text-xs font-mono text-white/80">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Available for new opportunities</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-white uppercase tracking-tight">
                            Let’s Connect & Collaborate
                        </h1>

                        <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed">
                            Have an exciting job opportunity, full-stack project, or AI workflow to build? Feel free to reach out via the form below or through direct channels.
                        </p>
                    </div>

                    {/* 2-Column Responsive Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                        
                        {/* LEFT: Direct Contact Channels (lg:col-span-5) */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            
                            {/* Direct Email Box */}
                            <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col gap-3">
                                <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                                    Direct Email
                                </span>
                                <div className="flex items-center justify-between gap-3">
                                    <a 
                                        href="mailto:sowmisowmiyan58@gmail.com"
                                        className="text-base sm:text-lg font-bold text-white hover:text-red-400 transition-colors truncate"
                                    >
                                        sowmisowmiyan58@gmail.com
                                    </a>
                                    <button
                                        onClick={handleCopyEmail}
                                        type="button"
                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-all shrink-0 cursor-pointer"
                                        title="Copy Email"
                                    >
                                        {copiedEmail ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Location & WhatsApp */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-neutral-950/80 border border-white/10 backdrop-blur-xl flex flex-col gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-500">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="text-xs font-mono uppercase tracking-wider text-white/50">Location</span>
                                    <span className="text-sm text-white font-medium">
                                        Namakkal, Tamil Nadu <br />
                                        <span className="text-xs text-white/50">Remote / Relocatable</span>
                                    </span>
                                </div>

                                <a 
                                    href="https://wa.me/919042561295"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-5 rounded-2xl bg-neutral-950/80 border border-white/10 hover:border-emerald-500/50 backdrop-blur-xl transition-all flex flex-col gap-2 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Phone size={16} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono uppercase tracking-wider text-white/50">WhatsApp</span>
                                        <ArrowUpRight size={14} className="text-white/40 group-hover:text-emerald-400 transition-colors" />
                                    </div>
                                    <span className="text-sm text-white font-medium group-hover:text-emerald-400 transition-colors">
                                        +91 90425 61295
                                    </span>
                                </a>
                            </div>

                            {/* Social & Resume Cards */}
                            <div className="flex flex-wrap gap-2.5">
                                <a
                                    href="https://linkedin.com/in/sowmiyan-s"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950/80 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all"
                                >
                                    <Linkedin size={14} className="text-blue-400" />
                                    <span>LinkedIn</span>
                                    <ArrowUpRight size={12} className="opacity-50" />
                                </a>

                                <a
                                    href="https://github.com/sowmiyan-s"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950/80 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all"
                                >
                                    <Github size={14} />
                                    <span>GitHub</span>
                                    <ArrowUpRight size={12} className="opacity-50" />
                                </a>

                                <a
                                    href={RESUME_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950/80 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-all ml-auto"
                                >
                                    <FileText size={14} className="text-red-400" />
                                    <span>Resume ↗</span>
                                </a>
                            </div>

                            {/* Response Note */}
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-950/60 border border-white/10 text-xs text-white/60 font-sans">
                                <Sparkles size={16} className="text-amber-400 shrink-0" />
                                <span>I respond promptly to all genuine inquiries within 24 hours.</span>
                            </div>
                        </div>

                        {/* RIGHT: Contact Form (lg:col-span-7) */}
                        <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 rounded-2xl bg-neutral-950/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
                            
                            <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                                <h2 className="text-xl sm:text-2xl font-heading font-black text-white uppercase tracking-tight">
                                    Send a Message
                                </h2>
                                <p className="text-xs sm:text-sm text-white/60 font-sans">
                                    Fill in the details below and it will land straight in my inbox.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                
                                {/* 3 Category Buttons: Hire Me / Freelance Work / General */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                                        Inquiry Type
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {categories.map((cat) => (
                                            <button
                                                type="button"
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                className={`py-2.5 px-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border text-center cursor-pointer ${
                                                    category === cat
                                                        ? 'bg-red-600 text-white font-bold border-red-600 shadow-md'
                                                        : 'bg-white/5 text-white/70 border-white/10 hover:text-white hover:border-white/20'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name & Email Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                                            <User size={12} className="text-red-500" />
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Alex Morgan"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-red-600 rounded-xl text-white text-sm font-sans focus:outline-none transition-all placeholder:text-white/30"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                                            <Mail size={12} className="text-red-500" />
                                            Your Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="alex@example.com"
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-red-600 rounded-xl text-white text-sm font-sans focus:outline-none transition-all placeholder:text-white/30"
                                        />
                                    </div>
                                </div>

                                {/* Message Field */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                                            <MessageSquare size={12} className="text-red-500" />
                                            Message *
                                        </label>
                                        <span className="text-xs font-mono text-white/40">
                                            {message.length} chars
                                        </span>
                                    </div>
                                    <textarea
                                        required
                                        rows={5}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Share your requirements, role details, or questions..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-red-600 rounded-xl text-white text-sm font-sans focus:outline-none transition-all placeholder:text-white/30 resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Feedback Alerts */}
                                <AnimatePresence>
                                    {submitStatus === 'success' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-400"
                                        >
                                            <Check size={18} className="shrink-0 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">Message Delivered!</span>
                                                <span className="text-xs text-white/80">
                                                    Thank you! Your note has been delivered to sowmisowmiyan58@gmail.com and I will reply soon.
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-400"
                                        >
                                            <span className="text-xs">
                                                Network error while submitting. Click to open your email client directly.
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleMailtoFallback}
                                                className="px-3.5 py-1.5 bg-red-600 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-wider rounded-lg transition-colors font-bold shrink-0"
                                            >
                                                Open Email Client →
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit & Fast Connect Row */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
                                    <a
                                        href={getWhatsAppUrl()}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-wider transition-all"
                                        title="Chat directly on WhatsApp"
                                    >
                                        <Phone size={14} />
                                        <span>Chat on WhatsApp</span>
                                    </a>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-red-600/20"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <Send size={14} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </main>

                <Footer />
            </ProjectPattern>
        </div>
    );
};

export default ContactPage;
