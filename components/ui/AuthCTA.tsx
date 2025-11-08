import { Button } from "@/components/ui/button";


const AuthCTA = () => {
  return (
    <section className="mx-auto mt-20 w-full max-w-5xl px-4 sm:px-6">
      <div className="rounded-3xl bg-gradient-to-r from-primary-bright to-primary-dark p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="font-tiktok text-xs tracking-[0.4em] text-white/80">
              Members club
            </p>
            <h2 className="font-funnel text-3xl">
              Unlock concierge-only rates & waitlist access.
            </h2>
            <p className="max-w-xl text-sm text-white/85">
              Create an account or log in to sync saved itineraries, manage
              payments, and chat with a travel designer in minutes.
            </p>
          </div>
          <form className="flex w-full max-w-md flex-col gap-3 rounded-2xl bg-white/15 p-4 backdrop-blur">
            <input
              type="email"
              required
              placeholder="Email address"
              className="rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none"
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1 rounded-2xl bg-white text-primary-bright hover:bg-white/90">
                Log in
              </Button>
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl border border-white/50 text-white hover:bg-white/10"
              >
                Create account
              </Button>
            </div>
            <p className="text-xs text-white/70">
              By continuing, you agree to curated emails and our privacy policy.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AuthCTA;
