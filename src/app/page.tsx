
"use client";

import React from 'react';
import ClockDisplay from '@/components/global-clock/ClockDisplay';
import { US_TIMEZONES, INDIA_TIMEZONE } from '@/lib/timezones';

export default function HomePage() {
  const easternTimezoneDetails = US_TIMEZONES.find(tz => tz.value === 'America/New_York');

  return (
    <div className="flex justify-start items-start min-h-screen p-4 sm:p-8 bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* This div ensures clocks are stacked and positioned in the corner */}
      <div className="flex flex-col gap-3">
        <ClockDisplay
          key="india"
          label={INDIA_TIMEZONE.label}
          ianaTimezone={INDIA_TIMEZONE.value}
        />
        {easternTimezoneDetails && (
          <ClockDisplay
            key={easternTimezoneDetails.value}
            label={easternTimezoneDetails.label}
            ianaTimezone={easternTimezoneDetails.value}
          />
        )}
      </div>
    </div>
  );
}
