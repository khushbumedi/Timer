
"use client";

import React from 'react';
import ClockDisplay from '@/components/global-clock/ClockDisplay';
import { US_TIMEZONES, INDIA_TIMEZONE } from '@/lib/timezones';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const easternTimezoneDetails = US_TIMEZONES.find(tz => tz.value === 'America/New_York');

  return (
    <div className="flex justify-start items-start min-h-screen p-4 sm:p-8 bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* This div ensures the Card takes width based on its content */}
      <div className="w-auto">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* Layout for clocks: stacked on small screens, side-by-side on medium and larger */}
            <div className="flex flex-col md:flex-row gap-6">
              <section aria-labelledby="india-clock-heading" className="w-full md:w-auto">
                 <h2 id="india-clock-heading" className="sr-only">India Time</h2>
                <ClockDisplay
                  key="india"
                  label={INDIA_TIMEZONE.label}
                  ianaTimezone={INDIA_TIMEZONE.value}
                />
              </section>

              {easternTimezoneDetails && (
                <section aria-labelledby="us-clock-heading" className="w-full md:w-auto">
                  <h2 id="us-clock-heading" className="sr-only">US Eastern Time</h2>
                  <ClockDisplay
                    key={easternTimezoneDetails.value}
                    label={easternTimezoneDetails.label} // Displays "Eastern Time (ET)"
                    ianaTimezone={easternTimezoneDetails.value}
                  />
                </section>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
