import { useReveal } from "@/hooks/use-reveal";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Download, ArrowRight, CheckCircle2, ChevronRight, GraduationCap, Briefcase, Star, Music, BookOpen } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import profileImg from "@assets/file_0000000055a47243b1523fc0a80b8f2a_1777721049718.png";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 40);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-primary/15 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", right: "5%" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-secondary/20 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "15%", left: "8%" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-primary/10 blur-2xl"
        animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "50%", left: "40%" }}
      />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" } }),
};

export default function Home() {
  const revealRef = useReveal();

  const webDevSkills = [
    { category: "Basics", items: ["HTML", "CSS", "JavaScript"], inProgress: false },
    { category: "Framework", items: ["React.js", "Bootstrap"], inProgress: true },
    { category: "Backend", items: ["SQL", "Python"], inProgress: true },
    { category: "Design", items: ["Figma"], inProgress: true },
    { category: "Extra", items: ["Git", "Github"], inProgress: true },
  ];

  const coreStrengths = [
    { label: "Microsoft Office Suite", icon: <Star className="w-4 h-4" /> },
    { label: "Effective Communication", icon: <Star className="w-4 h-4" /> },
    { label: "Customer Service", icon: <Star className="w-4 h-4" /> },
    { label: "Team Management", icon: <Star className="w-4 h-4" /> },
  ];

  const interests = [
    { label: "Reading", icon: <BookOpen className="w-5 h-5 text-primary" /> },
    { label: "Listening to Music", icon: <Music className="w-5 h-5 text-primary" /> },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section
        id="home"
        className="min-h-[100dvh] flex items-center justify-center pt-20 relative overflow-hidden"
      >
        <FloatingOrbs />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-6 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <MapPin className="w-4 h-4" /> Abuja, Nigeria
              </div>
              <p className="text-sm font-extrabold italic text-muted-foreground tracking-wide">
                Matric No. <span className="text-primary">2025/1/102776CT</span>
              </p>
              <p className="text-sm font-extrabold italic text-muted-foreground tracking-wide">
                ID: <span className="text-primary">UBT25685</span>
              </p>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.1} className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Hi, I'm <span className="text-primary">Andrew</span>{" "}
                <span className="block">Marvelous Ojonache.</span>
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground font-serif italic">
                Web Developer & Strategist
              </p>
            </motion.div>

            <motion.p variants={fadeUp} custom={0.2} className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Turning operational discipline into creative digital solutions. I bridge the gap between technical systems and human experience to build things that last.
            </motion.p>

            <motion.div variants={fadeUp} custom={0.3} className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="rounded-full text-base px-8 h-14 group" asChild>
                <a href="#contact">
                  Let's Talk
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-14" asChild>
                <a href="#">
                  Download CV <Download className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeUp} custom={0.4} className="flex gap-8 pt-4 border-t border-border">
              {[
                { value: 2, suffix: "+", label: "Years Experience" },
                { value: 5, suffix: "+", label: "Skills Areas" },
                { value: 100, suffix: "%", label: "Committed" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted relative shadow-2xl border border-border">
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10" />
              <img
                src={profileImg}
                alt="Andrew Marvelous Ojonache"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-6 -right-6 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -z-10" />

            {/* Floating badge */}
            <motion.div
              className="absolute -left-8 bottom-24 bg-background border border-border rounded-2xl px-4 py-3 shadow-xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-xs text-muted-foreground">Based in</p>
              <p className="font-bold text-sm text-foreground">Abuja, Nigeria</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-8 reveal" ref={revealRef}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">01 / About Me</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-foreground">
              Rooted in operations. Driven by creation.
            </h3>
            <div className="prose prose-lg dark:prose-invert text-muted-foreground">
              <p>
                I started my journey ensuring systems ran flawlessly as a Computer Operator. For two years, I managed data processing, monitored system health, and troubleshot issues before they became problems.
              </p>
              <p>
                That foundation gave me a deep appreciation for efficiency and reliability. But I wanted to build the systems, not just operate them. Eager to leverage my technical foundation and strong interpersonal skills, I expanded into Web Development and Strategy.
              </p>
              <p>
                I bring the discipline of an operator, the communication of a customer service expert, and the ambition of a self-taught developer to every project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-16 reveal">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">02 / Expertise</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-foreground">
              Technical capability meets human capacity.
            </h3>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Technical Skills */}
            <div className="lg:col-span-8 space-y-8 reveal delay-100">
              <h4 className="text-xl font-medium border-b border-border pb-4">Web Development</h4>
              <div className="grid sm:grid-cols-2 gap-6">
                {webDevSkills.map((skillGroup, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.10)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-background/50 border-border/50 h-full">
                      <CardContent className="p-6">
                        <h5 className="font-serif italic font-semibold text-lg mb-1 text-foreground">
                          {skillGroup.category}
                        </h5>
                        {skillGroup.inProgress && (
                          <p className="text-xs italic text-muted-foreground mb-3">(still in process)</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {skillGroup.items.map((skill, sIdx) => (
                            <motion.div key={sIdx} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}>
                              <Badge
                                variant="secondary"
                                className="bg-secondary/50 hover:bg-primary hover:text-primary-foreground text-secondary-foreground transition-colors cursor-default"
                              >
                                {skill}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Core Strengths */}
            <div className="lg:col-span-4 space-y-8 reveal delay-200">
              <h4 className="text-xl font-medium border-b border-border pb-4">Core Strengths</h4>
              <ul className="space-y-4">
                {coreStrengths.map((skill, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-3 group cursor-default"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-muted-foreground text-lg group-hover:text-foreground transition-colors">
                      {skill.label}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience" className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 reveal">03 / History</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-16 reveal delay-100">
              Work Experience
            </h3>

            <div className="space-y-12">
              {[
                {
                  date: "02/2024 – 12/2025",
                  title: "Computer Operator",
                  company: "Lyon Computer Institute, Abuja",
                  points: [
                    "Managed and monitored computer systems, performing routine checks.",
                    "Troubleshot and resolved operational issues promptly and efficiently.",
                  ],
                  active: true,
                },
                {
                  date: "06/2023 – 02/2024",
                  title: "Computer Operator",
                  company: "Caseynet Computer, Abuja",
                  points: [
                    "Operated and maintained computer systems to ensure efficient data processing.",
                    "Ensured continuous system uptime and performance monitoring.",
                  ],
                  active: false,
                },
              ].map((job, idx) => (
                <motion.div
                  key={idx}
                  className={`relative pl-8 border-l ${job.active ? "border-primary/50" : "border-border"} reveal`}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full -left-[8.5px] top-1.5 border-4 border-card ${
                      job.active ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                  <div className="space-y-2">
                    <span className={`text-sm font-bold ${job.active ? "text-primary" : "text-muted-foreground"}`}>
                      {job.date}
                    </span>
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary opacity-70" />
                      {job.title}
                    </h4>
                    <p className="text-muted-foreground font-medium">{job.company}</p>
                    <ul className="mt-3 space-y-1">
                      {job.points.map((pt, pIdx) => (
                        <li key={pIdx} className="text-muted-foreground flex items-start gap-2">
                          <span className="text-primary font-bold mt-1 shrink-0">-</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 reveal">04 / Education</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-12 reveal delay-100">
              Academic Background
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  date: "2025 – Till Date",
                  degree: "Undergraduate Student",
                  school: "Federal University of Technology, Minna",
                  current: true,
                  delay: 0,
                },
                {
                  date: "01/2019 – 06/2022",
                  degree: "Senior School Certificate (SSCE)",
                  school: "Government Secondary School Jiwa, Abuja",
                  current: false,
                  delay: 100,
                },
                {
                  date: "02/2011 – 09/2016",
                  degree: "First School Leaving Certificate (FSLC)",
                  school: "LEA Primary School, Abuja",
                  current: false,
                  delay: 200,
                },
              ].map((edu, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
                  transition={{ duration: 0.2 }}
                  className={`reveal ${idx > 0 ? `delay-${edu.delay}` : ""}`}
                >
                  <Card className={`border-border/50 bg-card/50 shadow-none h-full transition-colors ${edu.current ? "border-primary/40" : "hover:border-primary/30"}`}>
                    <CardContent className="p-8 space-y-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${edu.current ? "bg-primary/20 text-primary" : "bg-secondary/50 text-secondary-foreground"}`}>
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <span className={`text-sm font-medium ${edu.current ? "text-primary font-bold" : "text-muted-foreground"}`}>
                        {edu.date}
                      </span>
                      {edu.current && (
                        <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">Current</span>
                      )}
                      <h4 className="text-lg font-bold leading-tight">{edu.degree}</h4>
                      <p className="text-muted-foreground">{edu.school}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section id="interests" className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2 reveal">05 / Interests</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-10 reveal delay-100">
              Beyond the screen.
            </h3>
            <div className="flex flex-wrap gap-6 reveal delay-200">
              {interests.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-background border border-border hover:border-primary/40 transition-colors cursor-default"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.18 }}
                >
                  {item.icon}
                  <span className="text-lg font-medium text-foreground">{item.label}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground mt-6 reveal delay-300">
              Finding rhythm in both books and music — always learning, always inspired.
            </p>
          </div>
        </div>
      </section>

      {/* Contact & References Section */}
      <section id="contact" className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 relative overflow-hidden reveal"
            whileHover={{ boxShadow: "0 30px 80px rgba(0,0,0,0.18)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <motion.div
              className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="grid md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                  Let's build something remarkable.
                </h3>
                <p className="text-primary-foreground/80 text-lg">
                  Available for web development projects, copywriting, and strategic roles.
                </p>

                <div className="space-y-4 pt-4">
                  <motion.a
                    href="mailto:andrewmarvelous144@gmail.com"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    whileHover={{ x: 4 }}
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-medium text-lg">andrewmarvelous144@gmail.com</span>
                  </motion.a>
                  <motion.a
                    href="tel:09161549140"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    whileHover={{ x: 4 }}
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium text-lg">09161549140</span>
                  </motion.a>
                </div>
              </div>

              <div className="bg-background text-foreground rounded-2xl p-6 shadow-xl">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Reference</h4>
                <div className="space-y-1">
                  <p className="font-bold text-lg">Mr. Andrew Yusuf</p>
                  <p className="text-muted-foreground">Business Man, Abuja</p>
                  <motion.a
                    href="tel:07038691536"
                    className="text-primary hover:underline flex items-center gap-2 pt-2 mt-2 border-t border-border"
                    whileHover={{ x: 3 }}
                  >
                    <Phone className="w-4 h-4" /> 07038691536
                  </motion.a>
                  <p className="text-xs text-muted-foreground italic mt-2">Professional acquaintance.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
