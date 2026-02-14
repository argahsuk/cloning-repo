"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  BarChart3, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Globe, 
  FileText, 
  Trash2, 
  Factory 
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Report Issues, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
              Transform Your Community
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            CivicBridge unites residents and local authorities by providing 
            real-time issue tracking. Report potholes, faulty lighting, and more to 
            drive direct community improvement.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition flex items-center gap-2 shadow-lg hover:shadow-blue-200"
            >
              Report an Issue <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/issues"
              className="bg-white border-2 border-slate-200 hover:border-emerald-500 text-slate-700 px-8 py-4 rounded-full font-bold transition flex items-center gap-2"
            >
              <Globe className="w-5 h-5 text-emerald-500" /> View Map
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-slate-100 pt-12">
            <div>
              <p className="text-3xl font-bold text-blue-600">4,281</p>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Issues Reported</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-500">12,439</p>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Lives Impacted</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-3xl font-bold text-slate-800">415</p>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED IMAGE SECTION --- */}
      <section className="container mx-auto px-4 mb-24">
        <div className="relative rounded-3xl overflow-hidden h-[400px] shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000" 
            alt="Community park"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <button className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-medium border border-white/30 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Discover Your Local Impact
            </button>
          </div>
        </div>
      </section>

      {/* --- "WHAT CAN YOU REPORT" SECTION --- */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What Can You Report?</h2>
            <p className="text-slate-500">Our platform covers a wide range of civic issues to help keep your community safe.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Road Infrastructure", icon: <BarChart3 />, img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=60&w=800", desc: "Report potholes, broken sidewalks, or damaged street signs." },
              { title: "Street Lighting", icon: <FileText />, img: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=60&w=800", desc: "Report faulty street lights or dark areas in your neighborhood." },
              { title: "Waste Management", icon: <Trash2 />, img: "https://images.unsplash.com/photo-1532996122724-e3c3c5dca325?auto=format&fit=crop&q=60&w=800", desc: "Issues with garbage collection or illegal dumping sites." },
              { title: "Public Facilities", icon: <Factory />, img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=60&w=800", desc: "Damaged park equipment, benches, or public restrooms." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
                <div className="h-40 relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md">
                    {React.cloneElement(item.icon, { className: "w-5 h-5 text-blue-600" })}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION FOOTER --- */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-emerald-500 to-emerald-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-blue-50 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of engaged citizens today. Report, upvote, and track issues to improve your town.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <Users className="w-10 h-10 mb-4 mx-auto" />
              <h5 className="font-bold mb-2">For Citizens</h5>
              <p className="text-sm text-blue-100 mb-6">Report issues and track resolution progress in real-time.</p>
              <Link href="/register" className="block w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
                Get Started
              </Link>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <ShieldCheck className="w-10 h-10 mb-4 mx-auto" />
              <h5 className="font-bold mb-2">For Authorities</h5>
              <p className="text-sm text-blue-100 mb-6">Manage reports and communicate directly with residents.</p>
              <Link href="/contact" className="block w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}