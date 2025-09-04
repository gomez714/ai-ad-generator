import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Authentication from "@/app/_components/Authentication";
import { Sparkles, Zap, Rocket } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white to-purple-50/30">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px] md:h-[600px]">
          {/* Left Side - Google Login */}
          <div className="relative flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 text-center gap-6 md:gap-8 bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20">
            {/* Animated decorative elements - responsive positioning */}
            <div className="absolute top-4 sm:top-8 left-4 sm:left-8 h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-gradient-to-r from-primary/30 to-pink-400/30 opacity-80 blur-xl animate-pulse"></div>
            <div className="absolute bottom-6 sm:bottom-12 right-6 sm:right-12 h-20 sm:h-24 w-20 sm:w-24 rounded-full bg-gradient-to-l from-purple-400/40 to-blue-400/40 opacity-70 blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-2 sm:left-4 h-12 sm:h-16 w-12 sm:w-16 rounded-full bg-gradient-to-br from-pink-300/50 to-primary/50 opacity-60 blur-xl animate-pulse delay-500"></div>

            {/* Brand Section */}
            <div className="relative z-10 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-primary to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
                  <Sparkles className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Adcadabra
                </h1>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Welcome back!
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xs sm:max-w-sm mx-auto px-2">
                  Sign in to continue creating magical ad campaigns with AI
                </p>
              </div>

              {/* Feature highlights - responsive layout */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground mt-4 sm:mt-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  <span>Lightning Fast</span>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <Authentication>
              <Button
                size="lg"
                className="relative z-10 w-full max-w-xs sm:max-w-sm h-12 sm:h-14 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-primary/25"
                aria-label="Sign in with Google to access Adcadabra AI Ad Generator"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 sm:h-6 w-5 sm:w-6 mr-2 sm:mr-3"
                  aria-hidden="true"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span className="hidden sm:inline">Continue with Google</span>
                <span className="sm:hidden">Sign in with Google</span>
              </Button>
            </Authentication>

            {/* Trust indicators - responsive layout */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-xs text-muted-foreground/80 mt-4 px-4">
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full bg-green-500"
                  aria-hidden="true"
                ></div>
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full bg-blue-500"
                  aria-hidden="true"
                ></div>
                <span>Fast Login</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full bg-purple-500"
                  aria-hidden="true"
                ></div>
                <span>Privacy First</span>
              </div>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div
            className="relative hidden md:block overflow-hidden"
            role="img"
            aria-label="AI-powered ad generation visualization"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/30 to-pink-500/20"></div>

            {/* Image */}
            <img
              src="/login.jpg"
              alt="AI Ad Generation Visualization - Creative workspace with digital marketing elements"
              className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-80"
              loading="lazy"
            />

            {/* Overlay with content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Floating elements */}
            <div className="absolute top-4 md:top-8 right-4 md:right-8 p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/20">
              <div className="text-white text-xs md:text-sm font-medium">
                Explore the AI-powered ad generation
              </div>
            </div>

            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 space-y-1 md:space-y-2">
              <div className="text-white text-lg md:text-2xl font-bold">
                Create. Generate. Succeed.
              </div>
              <div className="text-white/80 text-xs md:text-sm">
                Join thousands creating stunning ads with AI
              </div>
            </div>

            {/* Animated particles - reduced motion friendly */}
            <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-white/60 rounded-full animate-ping motion-reduce:animate-none"></div>
            <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-purple-300/80 rounded-full animate-ping delay-300 motion-reduce:animate-none"></div>
            <div className="absolute top-1/2 right-1/2 w-4 h-4 bg-pink-300/60 rounded-full animate-ping delay-700 motion-reduce:animate-none"></div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary transition-colors">
        By continuing, you agree to our{" "}
        <a href="#" className="font-medium">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="font-medium">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
