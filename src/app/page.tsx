"use client";

import React, { useState, useMemo } from 'react';
import ClockDisplay from '@/components/global-clock/ClockDisplay';
import TimezoneSelector from '@/components/global-clock/TimezoneSelector';
import { US_TIMEZONES, INDIA_TIMEZONE, type TimezoneOption } from '@/lib/timezones';
import { Globe } from 'lucide-react';

export default function HomePage() {
  const [selectedUsTimezoneValue, setSelectedUsTimezoneValue] = useState<string>(US_TIMEZONES[0].value);

  const currentUsTimezoneDetails = useMemo(() => {
    return US_TIMEZONES.find(tz => tz.value === selectedUsTimezoneValue);
  }, [selectedUsTimezoneValue]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="mb-10 sm:mb-16 text-center">
        <div className="flex items-center justify-center space-x-3">
          <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-pulse" />
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Global<span className="text-primary">Clock</span>
          </h1>
        </div>
        <p className="mt-3 text-lg sm:text-xl text-muted-foreground">
          Track time across the globe, effortlessly.
        </p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section aria-labelledby="india-clock-heading">
           <h2 id="india-clock-heading" className="sr-only">India Time</h2>
          <ClockDisplay
            key="india" // Ensures component remounts if props that define its core identity change (not strictly needed here as props are static)
            label={INDIA_TIMEZONE.label}
            ianaTimezone={INDIA_TIMEZONE.value}
          />
        </section>

        <section aria-labelledby="us-clock-heading" className="flex flex-col space-y-6">
          <h2 id="us-clock-heading" className="sr-only">US Time</h2>
          <TimezoneSelector
            selectedTimezone={selectedUsTimezoneValue}
            onTimezoneChange={setSelectedUsTimezoneValue}
            timezones={US_TIMEZONES}
            placeholder="Choose a US Timezone"
          />
          {currentUsTimezoneDetails && (
            <ClockDisplay
              key={selectedUsTimezoneValue} // Key is important here for re-rendering when timezone changes
              label={currentUsTimezoneDetails.label}
              ianaTimezone={currentUsTimezoneDetails.value}
            />
          )}
        </section>
      </main>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} GlobalClock. All rights reserved.</p>
      </footer>
    </div>
  );
}
