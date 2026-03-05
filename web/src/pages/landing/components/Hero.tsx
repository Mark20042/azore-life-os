import {
  CalendarDays,
  CheckCircle2,
  Target,
  Sparkles,
  Play,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — Text Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-divider bg-default-100/60 text-sm text-default-600 mb-6">
              <Sparkles size={14} className="text-primary" />
              Your all-in-one life operating system
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-foreground leading-tight">
              Organize your life.{" "}
              <span className="text-primary">Achieve your goals.</span>
            </h1>

            <p className="mt-5 text-lg text-default-500 max-w-lg leading-relaxed">
              Azore Life OS brings tasks, calendars, and habits into one
              beautiful, focused workspace. Start building the life you want.
            </p>

            {/* Feature pills */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-divider bg-background/80 text-sm text-default-600">
                <CalendarDays size={16} className="text-primary" />
                Task Calendar
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-divider bg-background/80 text-sm text-default-600">
                <CheckCircle2 size={16} className="text-primary" />
                Smart Tasks
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-divider bg-background/80 text-sm text-default-600">
                <Target size={16} className="text-primary" />
                Goal Tracking
              </div>
            </div>
          </div>

          {/* Right — Video Demo Area */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none">
            <div className="relative group">
              {/* Browser-style frame */}
              <div className="rounded-2xl border border-divider bg-background shadow-2xl shadow-primary/5 overflow-hidden">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-divider bg-default-50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-danger/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                  </div>
                  <div className="flex-1 ml-3">
                    <div className="h-6 w-48 bg-default-100 rounded-md mx-auto flex items-center justify-center">
                      <span className="text-[10px] text-default-400">
                        azore-life-os.app
                      </span>
                    </div>
                  </div>
                </div>

                {/* Video / Demo placeholder */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                  {/* Placeholder: replace src with your actual demo video */}
                  <video
                    className="w-full h-full object-cover"
                    poster=""
                    muted
                    loop
                    playsInline
                    autoPlay
                  >
                    {/* Add your video source here:
                    <source src="/demo.mp4" type="video/mp4" /> */}
                  </video>

                  {/* Play overlay (shown when no video is loaded) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play
                        size={28}
                        className="text-primary ml-1"
                        fill="currentColor"
                      />
                    </div>
                    <span className="text-sm text-default-500 font-medium">
                      Watch Demo
                    </span>
                  </div>
                </div>
              </div>

              {/* Glow effect behind card */}
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10 group-hover:bg-primary/10 transition-colors duration-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
