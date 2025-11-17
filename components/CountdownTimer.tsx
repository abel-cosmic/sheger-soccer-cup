"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <Card className="bg-primary text-primary-foreground border-secondary/20 shadow-tournament px-6 py-4 min-w-[80px]">
      <div className="text-4xl font-bold tabular-nums">
        {value.toString().padStart(2, "0")}
      </div>
    </Card>
    <div className="text-sm font-semibold text-muted-foreground mt-2 uppercase tracking-wide">
      {label}
    </div>
  </div>
);
const CountdownTimer = () => {
  const calculateTimeLeft = (): TimeLeft => {
    // Calculate target date: Friday at 12:00 PM (5 days from now based on user request)
    const now = new Date();
    const targetDate = new Date();

    // Get the next Friday
    const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
    targetDate.setDate(now.getDate() + daysUntilFriday);
    targetDate.setHours(12, 0, 0, 0);

    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Registration Closes In
        </h3>
        <p className="text-muted-foreground">Friday, 12:00 PM</p>
      </div>
      <div className="flex justify-center gap-4">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

export default CountdownTimer;
