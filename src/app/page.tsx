
"use client";

import React, { useState, useMemo } from 'react';
import ClockDisplay from '@/components/global-clock/ClockDisplay';
import TimezoneSelector from '@/components/global-clock/TimezoneSelector';
import { US_TIMEZONES, INDIA_TIMEZONE, type TimezoneOption } from '@/lib/timezones';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const [selectedUsTimezoneValue, setSelectedUsTimezoneValue] = useState<string>(US_TIMEZONES[0].value);

  const currentUsTimezoneDetails = useMemo(() => {
    return US_TIMEZONES.find(tz => tz.value === selectedUsTimezoneValue);
  }, [selectedUsTimezoneValue]);

  return (
    <div className="flex justify-start items-start min-h-screen p-4 sm:p-8 bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="w-full max-w-sm">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <section aria-labelledby="india-clock-heading">
                 <h2 id="india-clock-heading" className="sr-only">India Time</h2>
                <ClockDisplay
                  key="india"
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
                    key={selectedUsTimezoneValue}
                    label={currentUsTimezoneDetails.label}
                    ianaTimezone={currentUsTimezoneDetails.value}
                  />
                )}
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
