import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, BarChart3, Zap, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const capabilities = [
  {
    number: '01',
    title: 'Live shipment visibility',
    description:
      'Know exactly where every order is — across carriers, borders, and modes. Get real-time ETAs and instant delay alerts before your customers even notice.',
    highlights: ['Multi-carrier tracking', 'Automated delay alerts', 'Live ETA updates'],
  },
  {
    number: '02',
    title: 'Predictive inventory planning',
    description:
      'Stop guessing what to stock. Our demand engine analyzes seasonality, lead times, and historical patterns to keep your shelves right-sized — never over, never under.',
    highlights: ['AI-driven forecasts', 'Reorder automation', 'Stockout prevention'],
  },
  {
    number: '03',
    title: 'Supplier risk & compliance',
    description:
      'Score every supplier. Track certifications, audit trails, and delivery reliability in one place. Surface risks before they become disruptions.',
    highlights: ['Supplier scorecards', 'Document tracking', 'Compliance dashboards'],
  },
  {
    number: '04',
    title: 'Unified analytics',
    description:
      'Your entire supply chain in a single view. Custom reports, cost breakdowns, and performance benchmarks that help you make faster, smarter decisions.',
    highlights: ['Custom dashboards', 'Cost analytics', 'Team collaboration'],
  },
];

const metrics = [
  { icon: Globe, value: '50+', label: 'Countries covered' },
  { icon: BarChart3, value: '10,000+', label: 'Shipments tracked' },
  { icon: Zap, value: '99.9%', label: 'Platform uptime' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-app-bg"
    >
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, #0F2B4E 0%, #143D5E 30%, #1D6B53 65%, #10B981 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pt-14 pb-12 sm:pt-20 sm:pb-16 md:pt-28 md:pb-20 text-center max-w-3xl mx-auto">
            <motion.span
              className="inline-flex bg-white/10 text-white/90 text-xs font-medium px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 mb-6 sm:mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              Supply Chain Intelligence Platform
            </motion.span>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            >
              Map your supply chain.
              <br />
              <span className="text-brand-accent">Master every move.</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-white/65 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
            >
              End-to-end visibility across shipments, warehouses, and suppliers.
              One platform for teams that move goods at scale.
            </motion.p>

            <motion.div
              className="flex gap-3 sm:gap-4 justify-center flex-wrap px-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.4, ease: 'easeOut' }}
            >
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-brand-deep font-semibold hover:bg-emerald-50 px-5 sm:px-7 h-11 sm:h-12 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
              >
                Start for free
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-white/10 text-white border border-white/20 hover:bg-white/15 px-5 sm:px-7 h-11 sm:h-12 rounded-lg text-sm transition-colors duration-200 cursor-pointer backdrop-blur-sm"
              >
                Get started
              </button>
            </motion.div>
          </div>

          {/* ─── Floating dashboard preview ─── */}
          <motion.div
            className="relative mx-auto max-w-5xl pb-16 sm:pb-24 md:pb-32"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
          >
            <div className="absolute -inset-4 bg-brand-accent/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-lg sm:rounded-xl overflow-hidden border border-white/15 shadow-2xl shadow-black/30">
              <img
                src="/preview.png"
                alt="SupplyMap dashboard showing global shipment tracking, live route maps, and operational metrics"
                className="w-full h-auto block"
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-app-bg to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Metrics strip ─── */}
      <section className="bg-app-bg pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
                >
                  <div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brand-accent/10 mb-2 sm:mb-3">
                    <Icon size={18} className="text-brand-accent sm:hidden" />
                    <Icon size={20} className="text-brand-accent hidden sm:block" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-text-primary">
                    {m.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-text-secondary mt-0.5">
                    {m.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Capabilities ─── */}
      <section className="bg-app-bg py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center mb-14 sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <p className="text-xs font-semibold tracking-widest text-brand-accent uppercase mb-3">
              CAPABILITIES
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3 sm:mb-4 px-2">
              Built for how supply chains actually work
            </h2>
            <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto px-2">
              Not another dashboard. A system that fits your operations — from
              procurement to last-mile.
            </p>
          </motion.div>

          {/* Capability rows */}
          <div className="space-y-16 sm:space-y-20">
            {capabilities.map((item, index) => (
              <motion.div
                key={item.number}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  delay: 0.05,
                  duration: 0.45,
                  ease: 'easeOut',
                }}
              >
                {/* Top line */}
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <span className="text-xs font-mono font-semibold text-brand-accent tracking-wider">
                    {item.number}
                  </span>
                  <div className="flex-1 h-px bg-app-border group-hover:bg-brand-accent/30 transition-colors duration-500" />
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start ${
                  index % 2 === 1 ? 'md:direction-rtl' : ''
                }`}>
                  {/* Text side */}
                  <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                    <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-5">
                      {item.description}
                    </p>

                    {/* Highlight tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.highlights.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-xs font-medium text-brand-primary bg-brand-accent/8 border border-brand-accent/15 px-3 py-1.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visual side — metrics / abstract representation */}
                  <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="bg-white border border-app-border rounded-xl p-5 sm:p-6 space-y-3">
                      {/* Mini metric rows that feel like a real UI */}
                      {index === 0 && (
                        <>
                          <MetricRow label="Active shipments" value="1,247" trend="+12%" positive />
                          <MetricRow label="On-time delivery" value="94.2%" trend="+3.1%" positive />
                          <MetricRow label="Avg. transit time" value="4.2 days" trend="-0.8d" positive />
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <MetricRow label="Forecast accuracy" value="96.8%" trend="+2.4%" positive />
                          <MetricRow label="Stockout events" value="3" trend="-67%" positive />
                          <MetricRow label="Overstock reduction" value="23%" trend="+8%" positive />
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <MetricRow label="Suppliers monitored" value="342" trend="+28" positive />
                          <MetricRow label="Risk score avg." value="Low" trend="Stable" positive />
                          <MetricRow label="Compliance rate" value="99.1%" trend="+0.6%" positive />
                        </>
                      )}
                      {index === 3 && (
                        <>
                          <MetricRow label="Cost per shipment" value="$14.20" trend="-11%" positive />
                          <MetricRow label="Reports generated" value="89" trend="+34" positive />
                          <MetricRow label="Team members" value="24" trend="+6" positive />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA banner ─── */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <motion.div
          className="max-w-4xl mx-auto rounded-xl sm:rounded-2xl overflow-hidden relative"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div
            className="px-5 py-10 sm:px-8 sm:py-14 md:px-16 md:py-16 text-center relative z-10"
            style={{
              background: 'linear-gradient(135deg, #0F2B4E 0%, #1D6B53 100%)',
            }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to see your supply chain clearly?
            </h2>
            <p className="text-white/60 mb-6 sm:mb-8 max-w-lg mx-auto text-sm md:text-base px-2">
              Join operations teams already using SupplyMap to cut delays,
              reduce costs, and ship with confidence.
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-brand-deep font-semibold hover:bg-emerald-50 px-5 sm:px-7 h-11 sm:h-12 rounded-lg text-sm transition-colors duration-200 cursor-pointer inline-flex items-center gap-2"
              >
                Get started free
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-transparent text-white border border-white/30 hover:bg-white/10 px-5 sm:px-7 h-11 sm:h-12 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-brand-deep text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="SupplyMap"
                className="h-7 w-auto brightness-0 invert"
              />
              <span className="font-bold text-lg text-white">SupplyMap</span>
            </div>
            <p className="text-white/50 text-sm mt-4 leading-relaxed max-w-xs">
              Real-time supply chain visibility for modern businesses. Track,
              analyze, and optimize movement of goods with confidence.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40 max-w-7xl mx-auto">
          <p>© 2025 SupplyMap. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

/* ─── Mini metric row component ─── */

function MetricRow({
  label,
  value,
  trend,
  positive,
}: {
  label: string;
  value: string;
  trend: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-app-border last:border-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-text-primary">{value}</span>
        <span
          className={`text-xs font-medium px-1.5 py-0.5 rounded ${
            positive
              ? 'text-brand-accent bg-brand-accent/10'
              : 'text-status-error bg-status-error/10'
          }`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
