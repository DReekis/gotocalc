"use client";

import { useMemo } from "react";
import { calculateAgeFunFacts } from "@/lib/ageUtils";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
});
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

interface Props {
    birthDate: Date;
    referenceDate?: Date;
}

function formatInt(value: number): string {
    return NUMBER_FORMATTER.format(value);
}

export default function AgeFunFacts({ birthDate, referenceDate }: Props) {
    const facts = useMemo(
        () => calculateAgeFunFacts(birthDate, referenceDate),
        [birthDate, referenceDate]
    );

    if (!facts) {
        return null;
    }

    return (
        <section className="age-panel">
            <div className="age-panel-head">
                <div>
                    <h3 className="age-panel-title">Your Life in Numbers</h3>
                    <p className="age-panel-copy">
                        A quick look at the milestones hidden inside your age.
                    </p>
                </div>
            </div>

            <div className="result-grid">
                <div className="result-item">
                    <div className="result-item-label">Total Days Lived</div>
                    <div className="result-item-value">{formatInt(facts.totalDaysLived)}</div>
                </div>
                <div className="result-item">
                    <div className="result-item-label">Total Weeks Lived</div>
                    <div className="result-item-value">{formatInt(facts.totalWeeksLived)}</div>
                </div>
                <div className="result-item">
                    <div className="result-item-label">Estimated Heartbeats</div>
                    <div className="result-item-value">{formatInt(facts.estimatedHeartbeats)}</div>
                </div>
                <div className="result-item">
                    <div className="result-item-label">Time Spent Sleeping</div>
                    <div className="result-item-value">
                        {formatInt(facts.totalSleepDays)} days
                    </div>
                    <p className="age-result-note">
                        About {formatInt(facts.totalSleepHours)} hours at 8 hours a day
                    </p>
                </div>
                <div className="result-item">
                    <div className="result-item-label">Western Zodiac</div>
                    <div className="result-item-value">{facts.zodiacSign}</div>
                </div>
                <div className="result-item">
                    <div className="result-item-label">Next Day Milestone</div>
                    <div className="result-item-value">
                        {formatInt(facts.nextDayMilestone.targetDays)} days old
                    </div>
                    <p className="age-result-note">
                        {facts.nextDayMilestone.daysUntilMilestone === 0
                            ? "That milestone is today."
                            : `${formatInt(facts.nextDayMilestone.daysUntilMilestone)} days to go`}
                    </p>
                    <p className="age-result-note">
                        On {DATE_FORMATTER.format(facts.nextDayMilestone.milestoneDate)}
                    </p>
                </div>
            </div>
        </section>
    );
}
