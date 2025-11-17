import CountdownTimer from "@/components/CountdownTimer";
import RegistrationForm from "@/components/RegistrationForm";
import { Card } from "@/components/ui/card";
import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="bg-primary shadow-tournament">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            <Image
              src={"/images/logo.png"}
              alt="Sheger School Cup"
              width={100}
              height={100}
              className="h-16 md:h-20 object-contain"
            />
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">
                SHEGER SCHOOL CUP
              </h1>
              <p className="text-sm md:text-base text-primary-foreground/80 font-medium">
                Quarter-Finals Registration
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Countdown Timer */}
        <div className="mb-12">
          <CountdownTimer />
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Tournament Bracket */}
          <div className="order-2 lg:order-1">
            <Card className="overflow-hidden border-2 border-border shadow-tournament bg-card">
              <div className="bg-primary p-4 border-b-4 border-secondary">
                <h2 className="text-xl font-bold text-primary-foreground text-center">
                  QUARTER-FINALS BRACKET
                </h2>
              </div>
              <div className="p-4 md:p-6">
                <Image
                  src={"/images/bracket.png"}
                  width={1000}
                  height={1000}
                  alt="Quarter-Finals Bracket"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </Card>

            {/* Tournament Info */}
            <Card className="mt-6 p-6 border-2 border-border bg-card">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Tournament Information
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">•</span>
                  <span>Teams must consist of 10-16 registered players</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">•</span>
                  <span>Valid school ID required for verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">•</span>
                  <span>Registration closes Friday at 12:00 PM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">•</span>
                  <span>Quarter-final matches begin the following week</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Right Side - Registration Form */}
          <div className="order-1 lg:order-2">
            <Card className="border-2 border-border shadow-tournament bg-card">
              <div className="bg-linear-to-r from-primary to-primary/90 p-6 border-b-4 border-secondary">
                <h2 className="text-2xl font-bold text-primary-foreground text-center mb-2">
                  Team Registration
                </h2>
                <p className="text-primary-foreground/90 text-center text-sm">
                  Complete the form below to register your team
                </p>
              </div>
              <div className="p-6 md:p-8">
                <RegistrationForm />
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary mt-16 py-6 border-t-4 border-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/80 text-sm">
            © 2024 Sheger School Cup. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
