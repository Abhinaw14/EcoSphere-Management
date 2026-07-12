import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BarChart3, 
  Globe, 
  Leaf, 
  Recycle, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import EcoSphereCanvas from '@/components/3d/EcoSphereCanvas';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* The beautiful 3D Canvas Background */}
        <div className="absolute inset-0 z-0">
          <EcoSphereCanvas />
          {/* A gradient overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6 text-sm text-primary backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Next-Gen Eco-Management Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Building a <span className="text-primary glow-text">Sustainable</span> Future, Today.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Empower your organization with intelligent sustainability tracking, 
              carbon footprint monitoring, and automated ESG reporting. Feel the impact.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={ROUTES.LOGIN} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full gradient-primary text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  Enter Dashboard <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-foreground font-semibold hover:bg-white/10 transition-colors">
                View Live Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. LIVE IMPACT DASHBOARD (Mock Data) */}
      <section id="impact" className="py-24 bg-background relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Real-Time Global Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform processes millions of data points to provide actionable insights.
              Join thousands of organizations making a measurable difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ImpactCard 
              icon={<Leaf className="h-8 w-8 text-primary" />} 
              value="12.4M" 
              label="Trees Planted" 
              delay={0.1} 
            />
            <ImpactCard 
              icon={<Globe className="h-8 w-8 text-[#6366F1]" />} 
              value="48.2k" 
              label="Tons CO2 Offset" 
              delay={0.2} 
            />
            <ImpactCard 
              icon={<Recycle className="h-8 w-8 text-[#F59E0B]" />} 
              value="9.8M" 
              label="Waste Recycled (kg)" 
              delay={0.3} 
            />
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-24 bg-black/40 relative z-10 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Scale Sustainably</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete suite of tools designed to track, manage, and optimize your environmental footprint.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<BarChart3 />}
              title="Carbon Accounting"
              desc="Automated Scope 1, 2, and 3 emission tracking with real-time dashboards."
            />
            <FeatureCard 
              icon={<Recycle />}
              title="Waste Management"
              desc="Track recycling rates, diversion metrics, and hazardous waste disposal."
            />
            <FeatureCard 
              icon={<Zap />}
              title="Energy Monitoring"
              desc="Integrate with smart meters to analyze usage patterns and optimize efficiency."
            />
            <FeatureCard 
              icon={<ShieldCheck />}
              title="ESG Compliance"
              desc="Generate audit-ready reports aligned with global standards (GRI, SASB)."
            />
            <FeatureCard 
              icon={<Leaf />}
              title="Virtual Forest"
              desc="Gamify sustainability by earning XP and planting digital (and physical) trees."
            />
            <FeatureCard 
              icon={<Globe />}
              title="Supply Chain"
              desc="Monitor vendor compliance and track emissions across your entire value chain."
            />
          </div>
        </div>
      </section>

      {/* 4. MISSION PARALLAX SECTION */}
      <section id="mission" className="py-32 bg-background relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Technology in harmony with <span className="text-primary italic">Nature</span>.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              We believe that environmental management shouldn't be about guilt or complex spreadsheets. 
              It should be empowering, data-driven, and beautiful. EcoSphere bridges the gap between 
              cutting-edge technology and natural preservation.
            </p>
            <Link to={ROUTES.LOGIN}>
              <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
                Start Your Journey
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
}

// Subcomponents for cleaner code
function ImpactCard({ icon, value, label, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center justify-center p-8 rounded-3xl bg-card border border-border/50 shadow-xl"
    >
      <div className="p-4 rounded-2xl bg-background border border-white/5 mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-4xl font-black mb-2 text-foreground tracking-tight">{value}</h3>
      <p className="text-muted-foreground font-medium">{label}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all group shadow-lg"
    >
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { className: 'h-6 w-6' })}
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}
